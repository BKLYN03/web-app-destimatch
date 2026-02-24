"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/models/user';
import { Destination } from '@/models/destination';
import getAllDestinations from '@/services/destination-service';
import DestinationCard from '@/components/DestinationCard';
import { Search, SlidersHorizontal, Loader2, Link, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

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

    const handleLogout = () => {
        localStorage.removeItem("destimatch_user");
        localStorage.removeItem("destimatch_token");
        window.location.replace("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        
                        <div className="flex flex-wrap justify-center gap-2">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Bonjour, <span className="text-primary">{user?.name?.split(' ')[0] || "Voyageur"}</span> 👋
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    Prêt à découvrir le monde ? Voici tes meilleures sélections.
                                </p>
                            </div>
                        </div>
                        
                        <div className="w-full md:w-auto flex items-start gap-5">
                            
                            <div className="flex-1">
                                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 mb-3">
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input 
                                            className="border-0 bg-transparent pl-9 focus-visible:ring-0 placeholder:text-slate-400 h-9 shadow-none" 
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

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="rounded-full mt-1 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform hover:scale-105 shrink-0">
                                        <Avatar className="h-11 w-11 border-2 border-slate-100 shadow-sm">
                                            {/* <AvatarImage src="/assets/tra.jpg" /> */}
                                            <AvatarImage className="object-cover" src="/assets/Tourist.jpg" />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                                {/* {user?.name ? user.name.charAt(0).toUpperCase() : "V"} */}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                
                                <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 mt-2">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-slate-900">{user?.name || "Voyageur"}</p>
                                            <p className="text-xs leading-none text-slate-500">{user?.email || "Prêt à partir"}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2">
                                        <Link href="/profile/update-preferences" className="flex items-center gap-2">
                                            <Settings className="h-4 w-4 text-slate-500" /> 
                                            <span>Mon profil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem 
                                        onSelect={() => setShowLogoutAlert(true)}
                                        className="rounded-lg cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 py-2"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" /> 
                                        <span>Se déconnecter</span>
                                    </DropdownMenuItem>
                                    
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
                                <AlertDialogContent className="sm:max-w-md rounded-2xl">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Êtes-vous sûr de vouloir vous déconnecter ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Vous devrez vous reconnecter pour accéder à vos sélections et vos préférences de voyage.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="sm:justify-end gap-2 mt-4">
                                        <AlertDialogCancel className="rounded-xl border-slate-200 hover:bg-slate-50">
                                            Annuler
                                        </AlertDialogCancel>
                                        
                                        <AlertDialogAction 
                                            onClick={handleLogout}
                                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Oui, me déconnecter
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Nos destinations</h2>
                        <p className="text-sm text-slate-500">Découvrez plus de nos destinations.</p>
                    </div>
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
