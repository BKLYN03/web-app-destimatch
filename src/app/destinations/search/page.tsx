"use client";

import DestinationCard from "@/components/DestinationCard";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Destination } from "@/models/destination";
import { User } from "@/models/user";
import { searchDestinations } from "@/services/destination-service";
import { Loader2, LogOut, Search, Filter, Settings, Star, Map, LayoutGrid, Home } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import DGoogleMap from "@/components/DGoogleMap";
// import dynamic from "next/dynamic";

const CONTINENTS = ["Asie", "Europe", "Afrique", "Amérique du Nord", "Amérique du Sud", "Océanie"];
const STYLES = ["SOLO", "COUPLE", "FRIENDS", "FAMILY"];
const BUDGETS = ["ECO", "MODERATE", "HIGH", "LUXURY"];
const ITEMS_PER_PAGE = 6;

// const MapView = dynamic(() => import("@/components/MapDestinations"), { 
//     ssr: false,
//     loading: () => (
//         <div className="h-full w-full bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center text-slate-400">
//             Chargement de la carte...
//         </div>
//     )
// });

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [rawResults, setRawResults] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

    const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
    const [sortBy, setSortBy] = useState("recommended");
    const [minRating, setMinRating] = useState(0);

    useEffect(() => {
        const savedUser = localStorage.getItem("destimatch_user");
        if (savedUser) {
            try { setUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
        }
    }, []);

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
                setRawResults(data);
                setCurrentPage(1);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [searchParams]);

    const budgetOrder: Record<string, number> = {
        "ECO": 1,
        "MODERATE": 2,
        "HIGH": 3,
        "LUXURY": 4
    };

    const processedResults = rawResults.filter(d => (d.rating || 0) >= minRating);

    processedResults.sort((a, b) => {
        switch (sortBy) {
            case "price_asc":
                return (budgetOrder[a.budget_level || ""] || 0) - (budgetOrder[b.budget_level || ""] || 0);
            case "price_desc":
                return (budgetOrder[b.budget_level || ""] || 0) - (budgetOrder[a.budget_level || ""] || 0);
            case "rating_desc":
                return (b.rating || 0) - (a.rating || 0);
            default:
                return 0;
        }
    });

    const totalPages = Math.ceil(processedResults.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentResults = processedResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);


    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get(key) === value) params.delete(key);
        else if (value) params.set(key, value);
        else params.delete(key);
        router.push(`/destinations/search?${params.toString()}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("destimatch_user");
        localStorage.removeItem("destimatch_token");
        window.location.replace("/login");
    };

    const resetAll = () => {
        setMinRating(0);
        setSortBy("recommended");
        router.push("/destinations/search");
    };

    return(
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-wrap justify-center gap-2">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    Recherche 🔎
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    {!loading && processedResults.length > 0 
                                        ? `${processedResults.length} destination(s) trouvée(s).`
                                        : "Explorez nos destinations."
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 w-full md:max-w-xl mx-auto">
                            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
                                <Search className="ml-3 h-4 w-4 text-slate-400" />
                                <Input 
                                    className="border-0 bg-transparent focus-visible:ring-0 placeholder:text-slate-400 h-9 shadow-none" 
                                    placeholder="Rechercher une destination..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") updateFilter("q", searchTerm); }}
                                />
                                <Button size="sm" className="rounded-full px-6 h-9" onClick={() => updateFilter("q", searchTerm)}>Chercher</Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="rounded-full mt-1 outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-transform hover:scale-105 shrink-0">
                                        <Avatar className="h-11 w-11 border-2 border-slate-100 shadow-sm">
                                            <AvatarImage className="object-cover" src="/assets/Tourist.jpg" />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg" />
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
                                    <DropdownMenuItem onSelect={() => router.replace("/home")} className="rounded-lg cursor-pointer py-2">
                                        <Home className="h-4 w-4 text-slate-500" /> 
                                        <span>Accueil</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2">
                                        <Link href="/profile/update-preferences" className="flex items-center gap-2">
                                            <Settings className="h-4 w-4 text-slate-500" /> 
                                            <span>Mon profil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => setShowLogoutAlert(true)} className="rounded-lg cursor-pointer text-red-600 focus:bg-red-50 py-2">
                                        <LogOut className="h-4 w-4 mr-2" /> <span>Se déconnecter</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    <aside className="w-full lg:w-64 shrink-0 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Filtres
                            </h3>
                            <Button variant="ghost" size="sm" className="text-xs text-slate-500 h-auto p-0 hover:text-primary hover:bg-transparent" onClick={resetAll}>
                                Réinitialiser
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-900">Note des voyageurs</h4>
                            <div className="space-y-2">
                                {[4, 3, 2].map((star) => (
                                    <div 
                                        key={star} 
                                        onClick={() => setMinRating(minRating === star ? 0 : star)}
                                        className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${minRating === star ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-slate-100'}`}
                                    >
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${minRating === star ? 'border-yellow-500 bg-yellow-500' : 'border-slate-300'}`}>
                                            {minRating === star && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-700">
                                            {Array.from({length: 5}).map((_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                            ))}
                                            <span className="ml-2 font-medium">& plus</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-900">Budget</h4>
                            <div className="flex flex-wrap gap-2">
                                {BUDGETS.map((budget) => {
                                    const isActive = searchParams.get("budget") === budget;
                                    return (
                                        <Badge key={budget} variant={isActive ? "default" : "outline"} className={`cursor-pointer px-3 py-1.5 rounded-lg ${!isActive && 'bg-white hover:bg-slate-50 text-slate-600'}`} onClick={() => updateFilter("budget", budget)}>
                                            {budget === "ECO" ? "💰 Eco" : budget === "MODERATE" ? "💰💰 Moyen" : budget === "HIGH" ? "💰💰💰 Elevé" : "💰💰💰💰 Luxe"}
                                        </Badge>
                                    )
                                })}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-900">Continent</h4>
                            <div className="space-y-2">
                                {CONTINENTS.map((cont) => (
                                    <div key={cont} className="flex items-center space-x-2">
                                        <Checkbox id={cont} checked={searchParams.get("continent") === cont} onCheckedChange={() => updateFilter("continent", cont)} />
                                        <Label htmlFor={cont} className="text-sm font-normal cursor-pointer leading-none">{cont}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* <Separator />

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-900">Style de voyage</h4>
                            <div className="flex flex-wrap gap-2">
                                {STYLES.map((style) => {
                                    const isActive = searchParams.get("style") === style;
                                    return (
                                        <div 
                                            key={style}
                                            onClick={() => updateFilter("style", style)}
                                            className={`
                                                text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer transition-all
                                                ${isActive 
                                                    ? "bg-primary/10 border-primary text-primary" 
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}
                                            `}
                                        >
                                            {style}
                                        </div>
                                    )
                                })}
                            </div>
                        </div> */}
                    </aside>

                    <div className="flex-1">
                        
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                            <h2 className="text-lg font-bold text-slate-900 hidden md:block">
                                Résultats ({processedResults.length})
                            </h2>
                            
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                {/* <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[180px] bg-white rounded-full h-10 border-slate-200">
                                        <SelectValue placeholder="Trier par" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recommended">Recommandés</SelectItem>
                                        <SelectItem value="price_asc">Prix croissant</SelectItem>
                                        <SelectItem value="price_desc">Prix décroissant</SelectItem>
                                        <SelectItem value="rating_desc">Mieux notés</SelectItem>
                                    </SelectContent>
                                </Select> */}

                                <div className="flex bg-white rounded-full p-1 border border-slate-200">
                                    <button 
                                        onClick={() => setViewMode("grid")}
                                        className={`p-2 rounded-full transition-all ${viewMode === "grid" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => setViewMode("map")}
                                        className={`p-2 rounded-full transition-all ${viewMode === "map" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                    >
                                        <Map className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
                                    {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>)}
                                </div>
                            ) : processedResults.length > 0 ? (
                                <>
                                    {viewMode === "grid" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                            {currentResults.map(dest => (
                                                <DestinationCard key={dest.id} {...dest} />
                                            ))}
                                        </div>
                                    ) : (
                                        // <div className="bg-slate-100 rounded-3xl h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-slate-300 mb-8 relative overflow-hidden group">
                                        //     <div className="absolute inset-0 bg-[url('https://assets.website-files.com/5e832e12eb7ca02ee9064d42/5f7db426b676b94d55b3444c_map-placeholder.jpg')] bg-cover opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                        //     <div className="z-10 bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                                        //         <Map className="h-12 w-12 text-primary mx-auto mb-4" />
                                        //         <h3 className="text-xl font-bold text-slate-900 mb-2">Vue Carte Interactive</h3>
                                        //         <p className="text-slate-500">Bientôt disponible! Vous pourrez voir vos destinations favorites sur une carte.</p>
                                        //         <Button className="mt-6" variant="outline" onClick={() => setViewMode("grid")}>Retour à la liste</Button>
                                        //     </div>
                                        // </div>

                                        <div className="h-[600px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm mb-8 relative z-0">
                                            <DGoogleMap destinations={processedResults} />
                                        </div>
                                    )}

                                    {viewMode === "grid" && totalPages > 1 && (
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious 
                                                        href="#" 
                                                        onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(p => p - 1); }}
                                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>
                                                {Array.from({ length: totalPages }).map((_, idx) => {
                                                    const pageNum = idx + 1;
                                                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                                        return (
                                                            <PaginationItem key={pageNum}>
                                                                <PaginationLink href="#" isActive={currentPage === pageNum} onClick={(e) => { e.preventDefault(); setCurrentPage(pageNum); }}>
                                                                    {pageNum}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        );
                                                    }
                                                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <PaginationItem key={pageNum}><PaginationEllipsis /></PaginationItem>;
                                                    return null;
                                                })}
                                                <PaginationItem>
                                                    <PaginationNext 
                                                        href="#" 
                                                        onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(p => p + 1); }}
                                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900">Aucun résultat</h3>
                                    <p className="text-slate-500 mb-6">Essayez de modifier vos filtres.</p>
                                    <Button variant="outline" onClick={resetAll}>Tout effacer</Button>
                                </div>
                            )}
                        </Suspense>
                    </div>

                </div>
            </main>

            <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
                <AlertDialogContent className="sm:max-w-md rounded-2xl">
                    <AlertDialogHeader><AlertDialogTitle>Déconnexion</AlertDialogTitle><AlertDialogDescription>Voulez-vous vraiment nous quitter ?</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Déconnexion</AlertDialogAction></AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
