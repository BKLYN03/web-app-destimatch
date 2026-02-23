"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/models/user';
import { Destination } from '@/models/destination';
import getAllDestinations from '@/services/destination-service';
import DestinationCard from '@/components/DestinationCard';
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const savedUser = localStorage.getItem("destimatch_user");
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error("Erreur lecture user", e);
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        getAllDestinations()
            .then(data => {
                setDestinations(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Bonjour, <span className="text-primary">{user?.name?.split(' ')[0] || "Voyageur"}</span> 👋
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Prêt à découvrir le monde ? Voici nos meilleures sélections pour toi.
                            </p>
                        </div>
                        
                        <div className="flex w-full md:w-auto items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    className="border-0 bg-transparent pl-9 focus-visible:ring-0 placeholder:text-slate-400 h-9" 
                                    placeholder="Où veux-tu aller ?" 
                                />
                            </div>
                            <Button size="sm" variant="ghost" className="rounded-full h-9 w-9 p-0 hover:bg-white hover:shadow-sm">
                                <SlidersHorizontal className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button size="sm" className="rounded-full px-6 h-9">
                                Chercher
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-slate-800">Destinations recommandées</h2>
                    <span className="text-sm text-slate-500">{destinations.length} résultats trouvés</span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((dest) => (
                            <DestinationCard key={dest.id} {...dest} />
                        ))}
                    </div>
                )}

                {!loading && destinations.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-400">Aucune destination trouvée pour le moment.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
