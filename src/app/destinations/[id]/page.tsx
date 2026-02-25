"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, Wallet, Calendar, Users, ArrowLeft, Plus, Heart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Destination } from "@/models/destination";
import { Review } from "@/models/review";
import { getDestinationById } from "@/services/destination-service";
import { getReviewsForDestination } from "@/services/review-service";
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/models/user";
import { toast } from "sonner";

interface HistoryItem {
    id: string;
    name: string;
    country: string;
    image: string;
}

const getMonthNames = (months: number[]) => {
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    return months.map(m => monthNames[m - 1]).join(", ");
};

export default function DestinationDetailsPage() {
    const route = useRouter();

    const params = useParams();
    const destinationId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [destination, setDestination] = useState<Destination | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(1);
    const [reviewContent, setReviewContent] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addToHistory = (dest: Destination) => {
        try {
            const savedHistory = localStorage.getItem("destimatch_history");
            let history: HistoryItem[] = savedHistory ? JSON.parse(savedHistory) : [];

            const newItem: HistoryItem = {
                id: dest.id,
                name: dest.name,
                country: dest.location.country,
                image: dest.images?.[0] || "/assets/placeholder.jpg"
            };

            history = history.filter((item: HistoryItem) => item.id !== dest.id);
            
            history.unshift(newItem);

            if (history.length > 5) history.pop();

            localStorage.setItem("destimatch_history", JSON.stringify(history));
        } catch (e) {
            console.error("Erreur sauvegarde historique", e);
        }
    };

    useEffect(() => {
        Promise.all([getDestinationById(destinationId), getReviewsForDestination(destinationId)])
           .then(([destData, reviewsData]) => {
               setDestination(destData);
               setReviews(reviewsData);

               addToHistory(destData);
           })
           .finally(() => setLoading(false));
    }, [destinationId]);
    

    useEffect(() => {
        const savedUser = localStorage.getItem("destimatch_user");
        if (savedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const handleSubmitReview = () => {
        if (!user) {
            toast.error("Connectez-vous pour laisser un avis !");
            return;
        }
        
        // TODO: Appeler ton vrai service API ici : await createReview(newReview)...
    };

    if (loading) 
        return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Chargement de votre voyage...</div>;
    if (!destination) 
        return <div className="min-h-screen flex items-center justify-center">Destination introuvable 😢</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            
            <div className="relative w-full h-[60vh] md:h-[75vh] bg-slate-900 group">
                <Link href="#" onClick={() => route.back()} className="absolute top-6 left-6 z-20">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-white/90 hover:bg-white transition-all">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>

                <div className="absolute top-6 right-6 z-20 flex gap-2">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-white/90 hover:bg-white text-red-500 hover:text-red-600 transition-all">
                        <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-white/90 hover:bg-white text-slate-700 transition-all">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
                
                <Image 
                    src={destination.images?.[0] || "/placeholder.jpg"} 
                    alt={destination.name}
                    fill
                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-10 text-white">
                    <div className="max-w-5xl mx-auto">
                        <Link href={`/destinations/search?continent=${destination.location.continent}`}>
                            <div className="w-fit mb-4 bg-white/90 rounded-full hover:bg-white text-slate-900 backdrop-blur-md px-2 pb-1 pt-1 text-sm font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1">
                                {destination.location.continent === "Afrique" && (
                                    <span>🌍{destination.location.continent}</span>
                                )}
                                {(destination.location.continent === "Asie" || destination.location.continent === "Moyen-Orient" 
                                    || destination.location.continent === "Océanie") && (
                                    <span>🌏{destination.location.continent}</span>
                                )}
                                {(destination.location.continent === "Amérique du Sud" || destination.location.continent === "Amérique du Nord") && (
                                    <span>🌎{destination.location.continent}</span>
                                )}
                                {destination.location.continent === "Europe" && (
                                    <span>🌍{destination.location.continent}</span>
                                )}
                            </div>
                        </Link>
                        
                        <h1 className="text-4xl md:text-7xl mb-2 drop-shadow-lg leading-tight">
                            {destination.name}
                        </h1>
                        <div className="flex items-center text-slate-200 font-medium pb-3 text-lg md:text-xl">
                            <MapPin className="h-5 w-5 mr-2 text-primary" />
                            {destination.location.city}, {destination.location.country}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-t-3xl border-b border-slate-100 p-6 md:p-10 shadow-sm">
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                            <Wallet className="h-6 w-6 text-green-600 mb-2" />
                            <p className="text-xs text-slate-400 uppercase font-bold">Budget /j</p>
                            <p className="font-bold text-slate-800 text-lg">{destination.average_daily_cost} €</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 mb-2" />
                            <p className="text-xs text-slate-400 uppercase font-bold">Avis</p>
                            <p className="font-bold text-slate-800 text-lg">{destination.rating} <span className="text-sm font-normal text-slate-400">({destination.review_count})</span></p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center col-span-2 md:col-span-2">
                            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                            <p className="text-xs text-slate-400 uppercase font-bold">Meilleure Saison</p>
                            <p className="font-bold text-slate-800 text-lg">{getMonthNames(destination.best_months)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">À propos</h2>
                                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                                    {destination.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {destination.official_tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm bg-slate-100 text-slate-700">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </section>

                            <section className="h-[300px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    title={`Carte de ${destination.name}`}
                                    src={`https://maps.google.com/maps?q=${destination.location.latitude},${destination.location.longitude}&hl=fr&z=12&output=embed`}>
                                </iframe>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-600" /> Vibe du lieu
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {destination.compatible_styles.map(style => (
                                        <Badge key={style} className="bg-white border-slate-200 text-slate-700 hover:bg-white shadow-sm">
                                            {style}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 text-center">
                                <h3 className="font-bold text-primary mb-2">Prêt à partir ?</h3>
                                <p className="text-sm text-slate-500 mb-4">Trouvez les meilleurs vols et hôtels pour {destination.name}.</p>
                                <Button className="w-full font-bold shadow-lg shadow-primary/20">
                                    Réserver mon voyage
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-b-3xl pt-2 px-6 md:p-10 shadow-sm mb-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Avis des voyageurs <span className="text-slate-400 font-normal text-lg">({reviews.length})</span>
                        </h2>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 rounded-xl">
                                    <Plus className="h-4 w-4" /> Laisser un avis
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Laissez un avis sur {destination.name}</DialogTitle>
                                    <DialogDescription>
                                        Partagez votre expérience avec la communauté DestiMatch.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-6 py-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-slate-900">Note</span>
                                            <span className="font-bold text-yellow-600 flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md">
                                                {rating}/5 <Star className="h-4 w-4 fill-yellow-500" />
                                            </span>
                                        </div>
                                        <Slider
                                            step={1} max={5} min={0}
                                            value={[rating]}
                                            onValueChange={(vals) => setRating(vals[0])}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                    <Textarea 
                                        placeholder="Qu'avez-vous aimé ? Les paysages, la nourriture, l'ambiance ?" 
                                        className="min-h-[120px] resize-none focus-visible:ring-primary"
                                        value={reviewContent}
                                        onChange={(e) => setReviewContent(e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSubmitReview} disabled={!reviewContent.trim()}>
                                        Publier mon avis
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.length > 0 ? reviews.map((review, idx) => {
                            const isUserReview = review.user_email === user?.email;
                            return (
                                <div key={idx} className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
                                    isUserReview ? "bg-primary/5 border-primary/20" : "bg-slate-50 border-slate-100"
                                }`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold text-sm ${isUserReview ? "text-primary" : "text-slate-900"}`}>
                                                {review.author} {isUserReview && "(Vous)"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold bg-white px-2 py-1 rounded-full border shadow-sm">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            {review.rating}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{review.content}</p>
                                    {review.ai_keywords && (
                                        <div className="flex gap-2 mt-3">
                                            {review.ai_keywords.map(kw => (
                                                <span key={kw} className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">#{kw}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }) : (
                            <div className="col-span-2 text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed">
                                Soyez le premier à donner votre avis !
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
