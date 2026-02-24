"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
import { Destination } from "@/models/destination";
import L from "leaflet";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";

const iconUrl = "/assets/map/marker-icon.png";
const iconRetinaUrl = "/assets/map/marker-icon-2x.png";
const shadowUrl = "/assets/map/marker-shadow.png";

const customIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const getPseudoCoordinates = (name: string): [number, number] => {
    let hash = 0;
    for (let i = 0; i < name.length; i++)
        hash = name.charCodeAt(i) + ((hash << 5) - hash);

    const lat = (hash % 14000) / 100 - 60; 
    const lng = (hash % 36000) / 100 - 180;
    return [lat, lng];
}

interface MapProps {
    destinations: Destination[];
}

export default function MapDestinations({ destinations }: MapProps) {
    return (
        <>
            <style jsx global>{`
                .leaflet-pane img,
                .leaflet-tile,
                .leaflet-marker-icon,
                .leaflet-marker-shadow {
                    max-width: none !important;
                    max-height: none !important;
                    width: auto;
                    padding: 0;
                }
            `}</style>
            <MapContainer
                center={[20, 0]}
                zoom={2}
                scrollWheelZoom={true}
                className="h-full w-full rounded-3xl z-0"
                style={{ height: "100%", width: "100%" }}>
                <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                    {destinations.map((dest) => {
                        let position: [number, number];

                        if (dest.location.latitude && dest.location.longitude)
                            position = [dest.location.latitude, dest.location.longitude];
                        else
                            position = getPseudoCoordinates(dest.name);
                        
                        return (
                            <Marker key={dest.id} position={position} icon={customIcon}>
                                <Popup className="custom-popup">
                                    <div className="w-52 p-1">
                                        <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden">
                                            <Image 
                                                src={dest.images?.[0] || "/assets/placeholder.jpg"} 
                                                alt={dest.name} 
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-1 text-xs font-bold shadow-sm">
                                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                {dest.rating || "New"}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm mb-1">{dest.name}</h3>
                                        <p className="text-slate-500 text-xs mb-3 line-clamp-2">
                                            {dest.location.city}, {dest.location.country}
                                        </p>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-primary text-sm">
                                                {dest.average_daily_cost ? `${dest.average_daily_cost}€/j` : "Prix N/A"}
                                            </span>
                                            <Link href={`/destinations/${dest.id}`} className="bg-slate-900 text-white p-1.5 rounded-full hover:bg-primary transition-colors">
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })
                }
            </MapContainer>
        </>
    );
}
