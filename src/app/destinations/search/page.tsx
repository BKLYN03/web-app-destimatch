"use client";

import DestinationCard from "@/components/DestinationCard";
import { Destination } from "@/models/destination";
import { searchDestinations } from "@/services/destination-service";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function SearchPage() {
    const searchParams = useSearchParams();

    const [results, setResults] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);

            try {
                const params = {
                    q: searchParams.get("q"),
                    continent: searchParams.get("continent"),
                    tag: searchParams.get("tag"),
                    style: searchParams.get("style"),
                    budget: searchParams.get("budget"),
                };

                const data = await searchDestinations(params);
                setResults(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
        
    }, [searchParams]);

    const getSearchTitle = () => {
        const q = searchParams.get("q");
        const tag = searchParams.get("tag");
        const continent = searchParams.get("continent");
        const style = searchParams.get("style");

        const parts = [];
        if (q) 
            parts.push(`"${q}"`);
        if (tag) 
            parts.push(`"${tag}"`);
        if (continent) 
            parts.push(`en ${continent}`);
        if (style) 
            parts.push(`(style: ${style})`);
        
        return parts.length > 0 ? parts.join(" ") : "Toutes les destinations";
    };

    return(
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Suspense 
                    fallback={
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                        </div>
                    }>
                    <div>
                        <h1 className="text-2xl font-bold mb-6 text-slate-800">
                            {results.length} résultat(s) pour {getSearchTitle()}
                        </h1>
                        
                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {results.map(dest => (
                                    <DestinationCard key={dest.id} {...dest} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-500">
                                <p className="text-lg">Aucune destination ne correspond à ces critères... 😢</p>
                            </div>
                        )}
                    </div>
                </Suspense>
            </div>
        </div>
    );
}
