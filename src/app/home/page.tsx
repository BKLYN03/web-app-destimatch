"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/models/user";
import getAllDestinations, { DestinationMatch, getMatchingDestinations } from "@/services/destination-service";
import { Loader2, Star, Heart, MapPin, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Destination } from "@/models/destination";
import { useRouter } from "next/navigation";
import { getUserFavorites, removeFromFavorites, addToFavorites } from "@/services/favorite-service";
import { toast } from "sonner";

export default function HomePage() {

    const route = useRouter();

    const [matchedDestinations, setMatchedDestinations] = useState<DestinationMatch[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);

    const topMatch = matchedDestinations.length > 0 ? matchedDestinations[0] : null;
    const otherMatches = matchedDestinations.slice(1, 5);
    const inspirationMatches = matchedDestinations.slice(5, 9);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            const token = localStorage.getItem("destimatch_token");
            if (!token) return;

            try {
                const favorites = await getUserFavorites();
                const isFav = favorites.some((fav: any) => fav.id === topMatch?.id);
                
                setIsFavorite(isFav);
            } catch (err) {
                console.error("Erreur check favoris", err);
            }
        };
        checkFavoriteStatus();
    }, [topMatch?.id]);

    const handleToggleFavorite = async () => {
        const token = localStorage.getItem("destimatch_token");
        if (!token) {
            toast.error("Connectez-vous pour ajouter aux favoris !");
            return;
        }

        if (favLoading) return;

        const previousState = isFavorite;
        
        setIsFavorite(!isFavorite);
        setFavLoading(true);

        try {
            if (previousState) {
                await removeFromFavorites(topMatch!.id);
                toast.success("Retiré des favoris", { position: "top-center" });
            } else {
                await addToFavorites(topMatch!.id);
                toast.success("Ajouté aux favoris ❤️", { position: "top-center" });
            }
        } catch (error) {
            setIsFavorite(previousState);
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setFavLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const savedUser = localStorage.getItem("destimatch_user");
            if (savedUser && savedUser !== "undefined" && savedUser !== "[object Object]") {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error("Erreur lecture user", e);
                    localStorage.removeItem("destimatch_user"); 
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("destimatch_token");
        
        if (!token) {
            window.location.replace("/login");
        }
    }, []);

    useEffect(() => {
        getMatchingDestinations()
            .then(data => {
                setMatchedDestinations(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        getAllDestinations()
            .then(data => {
                setDestinations(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const hasMatchingCriteria = Boolean(user?.travel_style || user?.budget_level || (user?.preferences && user.preferences.length > 0));

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
                                    <Button onClick={() => route.push("/destinations/search")} size="sm" className="rounded-full px-6 h-9">
                                        Recherche...
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
                                        <Link href="/profile" className="flex items-center gap-2">
                                            <Settings className="h-4 w-4 text-slate-500" /> 
                                            <span>Mon profil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem 
                                        onSelect={() => setShowLogoutAlert(true)}
                                        className="rounded-lg cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 py-2"
                                    >
                                        <LogOut className="h-4 w-4" /> 
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <>
                        {!hasMatchingCriteria ? (
                            <section className="mb-14">
                                <div className="relative w-full h-[300px] md:h-[350px] rounded-3xl overflow-hidden shadow-lg flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-white via-sky-100 to-amber-50 border border-slate-200/50">
                                    
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="bg-sky-500/10 p-4 rounded-full mb-4 backdrop-blur-sm border border-sky-200/50 shadow-sm">
                                            <Wand2 className="h-10 w-10 text-sky-600" />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                                            Laissez la magie opérer ✨
                                        </h2>
                                        <p className="text-slate-600 text-sm md:text-base mb-6 max-w-lg">
                                            Nous n&apos;avons pas encore assez d&apos;informations pour vous surprendre. Complétez votre profil pour découvrir les destinations qui vous correspondent vraiment!
                                        </p>
                                        <Link href="/profile/update-preferences">
                                            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-12 text-base shadow-md transition-transform hover:scale-105">
                                                Compléter mon profil
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        ) : topMatch ? (
                            <section className="mb-14">
                                <div className="relative w-full h-[400px] md:h-[450px] rounded-3xl overflow-hidden shadow-xl group border border-slate-200/50">
                                    <Image
                                        src={topMatch.images?.[0] ?? '/placeholder.jpg'}
                                        alt={topMatch.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                    
                                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                                        <Badge className="bg-white/90 text-black hover:bg-white border-0 shadow-lg font-bold">
                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                                            {topMatch.rating || "N/A"}
                                        </Badge>
                                    </div>
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`rounded-full shadow-lg transition-all duration-300 ${
                                            isFavorite 
                                                ? "absolute right-4 top-4 z-20 rounded-full bg-white p-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 scale-110" 
                                                : "absolute right-4 top-4 z-20 rounded-full bg-white/30 p-2.5 text-white transition-colors hover:bg-white hover:text-red-500 backdrop-blur-md"
                                        }`}
                                    >
                                        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                                    </button>

                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                                        <p className="text-amber-400 font-semibold text-sm mb-2 flex items-center gap-1.5 drop-shadow-md">
                                            ✨ Match à {Math.round((topMatch.match_score || 0))}% • Parfait pour ton style
                                        </p>
                                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                                            {topMatch.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-gray-200 mb-4 font-medium drop-shadow-md">
                                            <MapPin className="h-4 w-4" />
                                            {topMatch.location?.city}, {topMatch.location?.country}
                                            <Link href={`/destinations/search?continent=${topMatch.location.continent}`}>
                                                <div className="bg-white/70 rounded-xl hover:bg-white/80 text-white border-white/30 backdrop-blur-sm px-2 pb-1 pt-1 text-xs">
                                                    {topMatch.location.continent === "Afrique" && (
                                                        <span style={{ color: "black" }}>🌍{topMatch.location.continent}</span>
                                                    )}
                                                    {(topMatch.location.continent === "Asie" || topMatch.location.continent === "Moyen-Orient" 
                                                        || topMatch.location.continent === "Océanie") && (
                                                        <span style={{ color: "black" }}>🌏{topMatch.location.continent}</span>
                                                    )}
                                                    {topMatch.location.continent === "Amérique du Sud" && (
                                                        <span style={{ color: "black" }}>🌎{topMatch.location.continent}</span>
                                                    )}
                                                    {topMatch.location.continent === "Amérique du Nord" && (
                                                        <span style={{ color: "black" }}>🌎{topMatch.location.continent}</span>
                                                    )}
                                                    {topMatch.location.continent === "Europe" && (
                                                        <span style={{ color: "black" }}>🌍{topMatch.location.continent}</span>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
                                        
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-6">
                                            <div className="flex flex-wrap gap-2">
                                                {topMatch.official_tags?.slice(0, 4).map((tag: string) => (
                                                    <Badge key={tag} className="bg-white/20 hover:bg-white/60 text-white border-white/30 backdrop-blur-sm px-3 pb-2 pt-1.5 text-xs">
                                                        <Link href={`/destinations/search?tag=${tag}`}>{tag}</Link>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                                <div className="text-right">
                                                    <div className="text-gray-300 text-[10px] uppercase font-bold">Budget moyen</div>
                                                    <div className="text-white font-bold text-xl leading-none">{topMatch.average_daily_cost}€<span className="text-xs font-normal text-gray-400"> / jour</span></div>
                                                </div>
                                                <Link href={`/destinations/${topMatch.id}`}>
                                                    <Button className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold px-6">
                                                        Détails
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ) : null}

                        {/* {otherMatches.length > 0 && (
                            <section className="mb-14">
                                <div className="flex items-end justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">Tes autres matchs parfaits</h2>
                                        <p className="text-sm text-slate-500">Basé sur tes préférences</p>
                                    </div>
                                    <Link href="/destinations" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                                        Tout voir →
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {otherMatches.map((match) => (
                                        <DestinationCard key={match.id} {...match} />
                                    ))}
                                </div>
                            </section>
                        )} */}

                        <section className="mb-14">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Nos destinations</h2>
                                    <p className="text-sm text-slate-500">Découvrez plus de nos destinations.</p>
                                </div>
                                <Link href="/destinations" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                                    Tout voir →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {destinations.slice(1, 5).map((match) => (
                                    <DestinationCard key={match.id} {...match} />
                                ))}
                            </div>
                        </section>

                        {inspirationMatches.length > 0 && (
                            <section className="mb-10">
                                <div className="flex items-end justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800 uppercase">
                                            Inspiré par {user?.preferences?.[0] || "tes envies"}
                                        </h2>
                                    </div>
                                    <Link href="/destinations/search" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                                        Tout voir →
                                    </Link>
                                </div>
                                
                                <div className="flex overflow-x-auto gap-6 pb-4 snap-x hide-scrollbar">
                                    {inspirationMatches.map((match) => (
                                        <div key={match.id} className="min-w-[280px] w-[280px] snap-start">
                                            <DestinationCard {...match} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
