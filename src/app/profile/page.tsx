"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "@/models/user";
import { MapPin, Edit, Heart, Settings, LogOut, Plane, Globe, Tag, History, Trophy, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const STYLES_INFO: Record<string, { icon: string, label: string }> = {
    'SOLO': { icon: '🎒', label: 'Solo' },
    'COUPLE': { icon: '👩‍❤️‍👨', label: 'Couple' },
    'FAMILY': { icon: '👨‍👩‍👧', label: 'Famille' },
    'FRIENDS': { icon: '🍻', label: 'Amis' },
};

const budget_level_INFO: Record<string, { icon: string, label: string }> = {
    'ECO': { icon: '💸', label: 'Économique' },
    'MODERATE': { icon: '💰', label: 'Modéré' },
    'HIGH': { icon: '💳', label: 'Confort' },
    'LUXURY': { icon: '💎', label: 'Luxe' },
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [history, setHistory] = useState<any[]>([]);
    const [completion, setCompletion] = useState(0);
    
    const calculateLevel = (u: User) => {
        let score = 0;
        if (u.location?.city && u.location?.country) score += 25;
        if (u.travel_style) score += 25;
        if (u.budget_level) score += 25;
        if (u.favorite_continents && u.favorite_continents.length > 0) score += 15;
        if (u.preferences?.length > 0) score += 10;
        setCompletion(score);
    };
    
    useEffect(() => {
        const savedUser = localStorage.getItem("destimatch_user");
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(parsedUser);
                calculateLevel(parsedUser); 
            } catch (e) { console.error("Erreur user", e); }
        }

        const savedHistory = localStorage.getItem("destimatch_history");
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Erreur historique", e);
                localStorage.removeItem("destimatch_history");
                setHistory([]);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("destimatch_user");
        localStorage.removeItem("destimatch_token");
        window.location.replace("/login");
    };

    const getLevelLabel = (score: number) => {
        if (score < 30) return { label: "Touriste Amateur", icon: "📸", color: "text-slate-500" };
        if (score < 60) return { label: "Voyageur Curieux", icon: "🧭", color: "text-blue-500" };
        if (score < 90) return { label: "Explorateur Averti", icon: "🌍", color: "text-purple-500" };
        return { label: "Maître du Monde", icon: "🚀", color: "text-orange-500" };
    };

    const levelInfo = getLevelLabel(completion);

    return (
        <div className="min-h-screen bg-slate-50/50">
            
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
                                <AvatarImage src="/assets/Tourist.jpg" className="object-cover" />
                                <AvatarFallback className="text-3xl font-bold bg-primary text-white">
                                    {user?.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-slate-100 text-2xl" title={levelInfo.label}>
                                {levelInfo.icon}
                            </div>
                        </div>
                        
                        <div className="text-center md:text-left flex-1 space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900">{user?.name || "Voyageur"}</h1>
                            <div className="flex flex-col md:flex-row items-center gap-3 text-slate-500 font-medium">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{user?.location?.city}, {user?.location?.country}</span>
                                </div>
                                <span className="hidden md:inline text-slate-300">|</span>
                                <div className={`flex items-center gap-1 font-bold ${levelInfo.color}`}>
                                    <Trophy className="h-4 w-4" />
                                    <span>{levelInfo.label}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {/* <Button variant="outline" onClick={() => router.push('/destinations/search')}>
                                Retour recherche
                            </Button> */}
                            <Button size="icon" onClick={() => router.replace("/home")} title="Accueil">
                                <Home className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={handleLogout} title="Déconnexion">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <Tabs defaultValue="overview" className="space-y-8">
                    
                    <TabsList className="grid w-full max-w-md grid-cols-3 mx-auto md:mx-0">
                        <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
                        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                        <TabsTrigger value="settings">Compte</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 animate-in fade-in-50">
                        
                        <Card className="border-none shadow-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1 w-full space-y-2">
                                    <div className="flex justify-between items-end">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            {completion === 100 ? "🎉 Profil complet !" : "🚀 Boostez votre profil"}
                                        </h3>
                                        <span className="text-sm opalocation.city-80">{completion}%</span>
                                    </div>
                                    <Progress value={completion} className="h-2 bg-slate-600 [&>*]:bg-green-400" />
                                    <p className="text-xs text-slate-300">
                                        {completion < 100 
                                            ? "Ajoutez vos préférences pour obtenir de meilleurs matchs." 
                                            : "Vous êtes prêt pour l'aventure !"}
                                    </p>
                                </div>
                                {completion < 100 && (
                                    <Link href="/profile/update-preferences">
                                        <Button size="sm" variant="secondary" className="whitespace-nowrap hover:bg-white">
                                            Compléter mon profil
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Plane className="h-4 w-4 text-primary" /> Mon ADN Voyageur
                                    </CardTitle>
                                    <Link href="/profile/update-preferences">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100
                                            bg-gradient-to-br from-sky-100 via-amber-100 to-orange-100 border-amber-300/70 shadow-md ring-1 ring-amber-200/50"
                                            suppressHydrationWarning={true}>
                                            <div className="text-3xl mb-2 filter drop-shadow-sm">
                                                {user?.travel_style ? STYLES_INFO[user.travel_style]?.icon : '❓'}
                                            </div>
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-0.5">Style</p>
                                            <p className="font-bold text-slate-900 text-sm">
                                                {user?.travel_style ? STYLES_INFO[user.travel_style]?.label : 'Non défini'}
                                            </p>
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100
                                            bg-gradient-to-br from-sky-100 via-amber-100 to-orange-100 border-amber-300/70 shadow-md ring-1 ring-amber-200/50"
                                            suppressHydrationWarning={true}>
                                            <div className="text-3xl mb-2 filter drop-shadow-sm">
                                                {user?.budget_level ? budget_level_INFO[user.budget_level]?.icon : '❓'}
                                            </div>
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-0.5">Budget</p>
                                            <p className="font-bold text-slate-900 text-sm">
                                                {user?.budget_level ? budget_level_INFO[user.budget_level]?.label : 'Non défini'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
                                            <Globe className="h-4 w-4" /> Continents préférés
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {user?.favorite_continents && user.favorite_continents.length > 0 ? (
                                                user.favorite_continents.map(c => (
                                                    <Link key={c} href={`/destinations/search?continent=${c}`}>
                                                        <Badge key={c} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">
                                                            {c}
                                                        </Badge>
                                                    </Link>
                                                ))
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">Aucune préférence</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-1">
                                                <Tag className="h-3 w-3" /> Préferences
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {user?.preferences && user.preferences.length > 0 ? (
                                                    user.preferences.map(t => (
                                                        <Link key={t} href={`/destinations/search?tag=${t}`}>
                                                            <Badge key={t} variant="secondary" className="bg-slate-100 text-slate-600">
                                                                {t}
                                                            </Badge>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-slate-400 italic">Aucun tag</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="h-full flex flex-col">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <History className="h-4 w-4 text-orange-500" /> Dernièrement vus
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    {history.length > 0 ? (
                                        <div className="space-y-3">
                                            {history.map((item, idx) => (
                                                item ? (
                                                    <Link href={`/destinations/${item.id}`} key={item.id || idx}>
                                                        <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                                                            <div className="h-12 w-12 rounded-md bg-slate-200 overflow-hidden flex-shrink-0 relative">
                                                                <Image 
                                                                    src={item.image || "/assets/placeholder.jpg"} 
                                                                    alt={item.name} 
                                                                    width={50}
                                                                    height={50}
                                                                    className="h-full w-full object-cover" 
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-sm text-slate-900 truncate">
                                                                    {item.name || "Destination"}
                                                                </h4>

                                                                <p className="text-xs text-slate-500 truncate">
                                                                    {item.country || "Pays inconnu"}
                                                                </p>
                                                            </div>
                                                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                                                        </div>
                                                    </Link>
                                                ) : null
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center py-8 opacity-60">
                                            <p className="text-sm font-medium text-slate-600">Aucun historique récent</p>
                                        </div>
                                    )}
                                </CardContent>
                                <div className="p-4 border-t bg-slate-50 rounded-b-xl">
                                    <Button variant="outline" className="w-full text-xs" onClick={() => router.push('/destinations/search')}>
                                        Explorer de nouvelles pépites
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="wishlist">
                        <Card>
                            <CardContent className="p-12 text-center flex flex-col items-center">
                                <div className="bg-pink-50 p-4 rounded-full mb-4">
                                    <Heart className="h-8 w-8 text-pink-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Vos favoris</h3>
                                <p className="text-slate-500 mb-6">
                                    Bientôt disponible : Retrouvez vos coups de cœur ici.
                                </p>
                                <Button onClick={() => router.push('/destinations/search')}>Explorer la carte</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardContent className="p-12 text-center flex flex-col items-center">
                                <Settings className="h-10 w-10 text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Paramètres</h3>
                                <p className="text-slate-500">Email : {user?.email}</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}
