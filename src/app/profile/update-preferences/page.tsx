"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllTags } from "@/services/destination-service";
import { updateUserPreferences } from "@/services/user-service";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const TRAVEL_STYLES = [
    { id: 'SOLO', icon: '🎒', label: 'En Solo', desc: 'L\'aventure en solitaire' },
    { id: 'COUPLE', icon: '👩‍❤️‍👨', label: 'En Couple', desc: 'Escapade romantique' },
    { id: 'FAMILY', icon: '👨‍👩‍👧', label: 'En Famille', desc: 'Des souvenirs pour tous' },
    { id: 'FRIENDS', icon: '🍻', label: 'Entre Amis', desc: 'Fête et découvertes' },
];

const BUDGET_LEVELS = [
    { id: 'ECO', icon: '💸', label: 'Économique', desc: '- de 60€ / jour' },
    { id: 'MODERATE', icon: '💰', label: 'Modéré', desc: '60€ à 160€ / jour' },
    { id: 'HIGH', icon: '💳', label: 'Confort', desc: '160€ à 400€ / jour' },
    { id: 'LUXURY', icon: '💎', label: 'Luxe', desc: 'Pas de limite' },
];

const CONTINENTS = [
    { id: 'EUROPE', label: '🌍 Europe' },
    { id: 'ASIA', label: '🌏 Asie' },
    { id: 'AFRICA', label: '🌍 Afrique' },
    { id: 'NORTH_AMERICA', label: '🌎 Amérique du Nord' },
    { id: 'SOUTH_AMERICA', label: '🌎 Amérique du Sud' },
    { id: 'OCEANIA', label: '🦘 Océanie' },
];

export default function UpdatePreferences() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingTags, setIsFetchingTags] = useState(true);

    const [communityTags, setCommunityTags] = useState<string[]>([]);
    const [travelStyle, setTravelStyle] = useState<string | null>(null);
    const [budgetLevel, setBudgetLevel] = useState<string | null>(null);
    const [favoriteContinents, setFavoriteContinents] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const fetchedTags = await getAllTags();
                setCommunityTags(fetchedTags);
            } catch (err) {
                console.error("Erreur lors du chargement des tags:", err);
                toast.error("Impossible de charger les envies/tags populaires.");
            } finally {
                setIsFetchingTags(false);
            }
        };
        fetchTags();
    }, []);

    const toggleContinent = (id: string) => {
        setFavoriteContinents(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const toggleTag = (tag: string) => {
        setTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await updateUserPreferences(travelStyle!, budgetLevel!, favoriteContinents, tags);
            
            toast.success("Préférences enregistrées avec succès!", { position: "top-center" });
            
            await new Promise(resolve => setTimeout(resolve, 800));
            router.push('/home');
        } catch (err) {
            console.error("Erreur détectée:", err);
            if (err instanceof Error) {
                toast.error("Une erreur s'est produite", {
                    description: err.message,
                });
            } else {
                toast.error("Une erreur inconnue s'est produite.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
                
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        Apprenons à nous connaître
                    </h1>
                    <p className="text-slate-500 text-lg">
                        Dis-nous ce que tu aimes, notre algorithme s&apos;occupe du reste.
                    </p>
                </div>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Avec qui voyages-tu ?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {TRAVEL_STYLES.map((style) => (
                            <div 
                                key={style.id}
                                onClick={() => setTravelStyle(style.id)}
                                className={cn(
                                    "cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center text-center transition-all duration-200",
                                    travelStyle === style.id 
                                        ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                                        : "border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50"
                                )}
                            >
                                <span className="text-4xl mb-3">{style.icon}</span>
                                <span className="font-bold text-slate-800">{style.label}</span>
                                <span className="text-xs text-slate-500 mt-1">{style.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Quel est ton budget moyen ?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {BUDGET_LEVELS.map((budget) => (
                            <div 
                                key={budget.id}
                                onClick={() => setBudgetLevel(budget.id)}
                                className={cn(
                                    "cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center text-center transition-all duration-200",
                                    budgetLevel === budget.id 
                                        ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                                        : "border-slate-200 bg-white hover:border-primary/30 hover:bg-slate-50"
                                )}
                            >
                                <span className="text-3xl mb-3">{budget.icon}</span>
                                <span className="font-bold text-slate-800">{budget.label}</span>
                                <span className="text-xs text-slate-500 mt-1">{budget.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Où aimerais-tu aller ? <span className="text-sm font-normal text-slate-400">(Plusieurs choix possibles)</span></h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {CONTINENTS.map((continent) => {
                            const isSelected = favoriteContinents.includes(continent.id);
                            return (
                                <div 
                                    key={continent.id}
                                    onClick={() => toggleContinent(continent.id)}
                                    className={cn(
                                        "cursor-pointer rounded-xl border p-3 flex items-center justify-between transition-all",
                                        isSelected 
                                            ? "border-primary bg-primary text-white font-semibold shadow-md" 
                                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                    )}
                                >
                                    <span>{continent.label}</span>
                                    {isSelected && <Check className="h-4 w-4" />}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-800">Quelles sont tes envies ?</h2>
                    {isFetchingTags ? (
                        <div className="flex items-center text-slate-500">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Chargement des envies...
                        </div>
                    ) : communityTags.length === 0 ? (
                        <p className="text-sm text-slate-500">Aucune envie disponible pour le moment.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {communityTags.map((tag) => {
                                const isSelected = tags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                                            isSelected
                                                ? "bg-slate-800 text-white shadow-sm"
                                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>

                <div className="pt-8 border-t border-slate-200 flex justify-end">
                    <Button 
                        onClick={handleSubmit} 
                        disabled={isLoading || !travelStyle || !budgetLevel || isFetchingTags}
                        className="rounded-xl px-8 h-12 text-lg font-semibold w-full md:w-auto"
                    >
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Magie en cours...</>
                        ) : (
                            "Enregistrer & Découvrir mes matchs ✨"
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
}
