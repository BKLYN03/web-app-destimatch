"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useJsApiLoader, Marker, InfoWindow, GoogleMap } from "@react-google-maps/api";
import { Destination } from "@/models/destination";
import Link from "next/link";
import { ArrowRight, Star, MapPin } from "lucide-react";

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '24px'
}

const defaultCenter = {
    lat: 48.8566,
    lng: 2.3522
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
};

const getPseudoCoordinates = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const lat = (hash % 14000) / 100 - 60; 
    const lng = (hash % 36000) / 100 - 180;
    return { lat, lng };
};

interface MapProps {
    destinations: Destination[]
}

export default function DGoogleMap({ destinations }: MapProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    });

    const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

    const markers = useMemo(() => destinations.map(dest => {
        let position;
        if (dest.location.latitude && dest.location.longitude) {
            position = { lat: dest.location.latitude, lng: dest.location.longitude };
        } else {
            position = getPseudoCoordinates(dest.name);
        }
        return { ...dest, position };
    }), [destinations]);

    if (!isLoaded) return (
        <div className="h-full w-full bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center text-slate-400">
            Chargement de Google Maps...
        </div>
    );

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={2}
            options={mapOptions}
            onClick={() => setSelectedDest(null)} 
        >
            {markers.map((dest) => (
                <Marker
                    key={dest.id}
                    position={dest.position}
                    onClick={() => setSelectedDest(dest)}
                    animation={google.maps.Animation.DROP} 
                />
            ))}

            {selectedDest && (
                <InfoWindow
                    position={
                        selectedDest.location.latitude && selectedDest.location.longitude
                        ? { lat: selectedDest.location.latitude, lng: selectedDest.location.longitude }
                        : getPseudoCoordinates(selectedDest.name)
                    }
                    onCloseClick={() => setSelectedDest(null)}
                    options={{ pixelOffset: new google.maps.Size(0, -30) }} // Décalage pour être au dessus du pin
                >
                    <div className="w-52 p-0 overflow-hidden font-sans">
                        <div className="relative h-28 w-full mb-2 rounded-lg overflow-hidden">
                            <Image 
                                src={selectedDest.images?.[0] || "/assets/placeholder.jpg"} 
                                alt={selectedDest.name} 
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 text-xs font-bold shadow-sm">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                {selectedDest.rating || "New"}
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm mb-0.5 truncate">{selectedDest.name}</h3>
                        
                        <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{selectedDest.location.city}, {selectedDest.location.country}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                            <span className="font-bold text-primary text-sm">
                                {selectedDest.average_daily_cost ? `${selectedDest.average_daily_cost}€/j` : "Prix N/A"}
                            </span>
                            <Link href={`/destinations/${selectedDest.id}`} className="flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-primary transition-colors">
                                Voir <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}
