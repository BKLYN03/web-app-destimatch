"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, Wallet, Calendar, Users, ArrowLeft, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Destination } from "@/models/destination";
import { Review } from "@/models/review";
import { getDestinationById } from "@/services/destination-service";
import { getReviewsForDestination } from "@/services/review-service";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User } from "@/models/user";

const getMonthNames = (months: number[]) => {
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    return months.map(m => monthNames[m - 1]).join(", ");
};

export default function DestinationDetailsPage() {
    const params = useParams();
    const destinationId = params.id as string;

    const [user, setUser] = useState<User | null>(null);

    const [destination, setDestination] = useState<Destination | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(5);
    const [reviewContent, setReviewContent] = useState("");

    const handleSubmitReview = () => {
        console.log("Avis à envoyer :", { rating, content: reviewContent });
        // Ici tu appelleras ton API Quarkus plus tard !
    };

    useEffect(() => {
        Promise.all([getDestinationById(destinationId), getReviewsForDestination(destinationId)])
           .then(([destData, reviewsData]) => {
               setDestination(destData);
               setReviews(reviewsData);
           }).finally(() => setLoading(false));
    }, [destinationId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const savedUser = localStorage.getItem("destimatch_user");
            if (savedUser && savedUser !== "undefined" && savedUser !== "[object Object]")
                setUser(JSON.parse(savedUser));
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    if (loading) 
        return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    if (!destination) 
        return <div>Destination introuvable</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="relative w-full h-[40vh] md:h-[60vh] bg-slate-800">
                <Link href="/home" className="absolute top-6 left-6 z-20">
                    <Button variant="secondary" size="icon" className="rounded-full shadow-lg">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                
                <Image 
                    src={destination.images?.[0] || "/placeholder.jpg"} 
                    alt={destination.name}
                    fill
                    className="object-cover opacity-80"
                />
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                                {destination.name}
                            </h1>
                            <div className="flex items-center text-slate-500 font-medium text-lg">
                                <MapPin className="h-5 w-5 mr-1 text-primary" />
                                {destination.location.city}, {destination.location.country}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                            <span className="text-2xl font-bold text-slate-900">{destination.rating}</span>
                            <span className="text-slate-400 font-medium">({destination.review_count} avis)</span>
                        </div>
                    </div>

                    <div className="w-full h-[200px] md:h-[350px] mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group">
                        <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-transparent transition-colors duration-300 z-10" />
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            className="relative z-0"
                            src={`https://maps.google.com/maps?q=${destination.location.latitude},${destination.location.longitude}&z=13&output=embed`}>
                        </iframe>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Wallet className="h-6 w-6" /></div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Budget</p>
                                <p className="font-semibold text-slate-800">{destination.average_daily_cost}€ / jour</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Calendar className="h-6 w-6" /></div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Meilleure période</p>
                                <p className="font-semibold text-slate-800 line-clamp-1">{getMonthNames(destination.best_months)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users className="h-6 w-6" /></div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Idéal pour</p>
                                <p className="font-semibold text-slate-800">{destination.compatible_styles.join(" • ")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">À propos</h2>
                        <p className="text-slate-600 leading-relaxed text-lg mb-6">
                            {destination.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {destination.official_tags.map(tag => (
                                <Badge key={tag} className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 px-3 py-1 text-sm">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            Avis des voyageurs <span className="text-slate-400 font-normal text-lg">({reviews.length})</span>
                        </h2>

                        <Dialog>
                            <HoverCard openDelay={10} closeDelay={100}>
                                <HoverCardTrigger asChild>
                                    <DialogTrigger asChild>
                                        <Button 
                                            size="icon" 
                                            className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm transition-transform hover:scale-105 shrink-0"
                                        >
                                            <Plus className="h-6 w-6" />
                                        </Button>
                                    </DialogTrigger>
                                </HoverCardTrigger>
                                
                                <HoverCardContent className="flex w-64 flex-col gap-0.5 mb-2">
                                    <div className="font-semibold">Ajoutez un avis!</div>
                                </HoverCardContent>
                            </HoverCard>

                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Laissez un avis</DialogTitle>
                                    <DialogDescription>
                                        Partagez votre expérience sur cette destination avec la communauté.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex flex-col gap-6 py-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-sm text-slate-900">Votre note globale</h4>
                                            <span className="font-bold text-yellow-600 flex items-center gap-1">
                                                {rating} <Star className="h-4 w-4 fill-yellow-500" />
                                            </span>
                                        </div>
                                        <Slider
                                            step={1}
                                            max={5}
                                            min={0}
                                            value={[rating]}
                                            onValueChange={(vals) => setRating(vals[0])}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium text-sm text-slate-900">Votre commentaire</h4>
                                        <Textarea 
                                            id="textarea-message" 
                                            placeholder="Racontez-nous ce que vous avez le plus aimé (ou détesté) !" 
                                            className="min-h-[120px] resize-none"
                                            value={reviewContent}
                                            onChange={(e) => setReviewContent(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <DialogFooter className="sm:justify-end gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary" className="rounded-xl">Annuler</Button>
                                    </DialogClose>
                                    
                                    <DialogClose asChild>
                                        <Button 
                                            onClick={handleSubmitReview}
                                            className="rounded-xl bg-primary text-white"
                                            disabled={!reviewContent.trim()}
                                        >
                                            Envoyer mon avis
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.length > 0 ? reviews.map((review, idx) => {
                            const isUserReview = review.user_email === user?.email;

                            return (
                                <div 
                                    key={idx} 
                                    className={`p-6 rounded-2xl shadow-sm border transition-all ${
                                        isUserReview 
                                            ? "bg-gradient-to-br from-sky-100 via-amber-100 to-orange-100 border-amber-300/70 shadow-md ring-1 ring-amber-200/50"
                                            : "bg-white border-slate-100"
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        {isUserReview ? (
                                            <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-amber-600 drop-shadow-sm">
                                                Vous
                                            </div>
                                        ) : (
                                            <div className="font-bold text-slate-900">{review.author}</div>
                                        )}
                                        
                                        <div className="flex items-center text-sm font-bold bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg">
                                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 mr-1" />
                                            {review.rating}
                                        </div>
                                    </div>
                                    
                                    <p className="italic">{review.content}</p>
                                    
                                    {review.ai_keywords && review.ai_keywords.length > 0 && (
                                        <div className="flex gap-1 mt-4">
                                            {review.ai_keywords.map(kw => (
                                                <span key={kw} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                                                    #{kw}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }) : (
                            <p className="text-slate-500">Aucun avis pour le moment. Soyez le premier !</p>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
