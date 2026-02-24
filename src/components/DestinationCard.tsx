import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Destination } from "@/models/destination";
import { Heart, Star, MapPin } from "lucide-react";

export default function DestinationCard(props: Destination) {
  const displayedTags = props.official_tags?.slice(0, 3) || [];

  return (
    <Card className="group relative overflow-hidden rounded-xl border-0 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col w-full p-0">
      
      <div className="relative aspect-[2/1] w-full overflow-hidden">
        
        <div className="absolute left-3 top-3 z-20">
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-black shadow-sm backdrop-blur-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {props.rating || "N/A"}
            </span>
        </div>

        <button className="absolute right-3 top-3 z-20 rounded-full bg-white/50 p-2 text-white transition-colors hover:bg-white hover:text-red-500 backdrop-blur-md">
            <Heart className="h-4 w-4" />
        </button>

        <Image
          src={props.images?.[0] ?? '/placeholder.jpg'}
          alt={props.name ?? 'Destination'}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardContent className="px-4 py-0 flex-1">        
        <div className="mb-2">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                {props.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="h-3 w-3" />
                {props.location.city}, {props.location.country}
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {displayedTags.map((tag) => (
            <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs px-2.5 pb-2 pt-1.5 font-normal"
            >
              <Link href={`/destinations/search?tag=${tag}`}>{tag}</Link>
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border px-4 pb-2 pt-3 bg-slate-50/50 mt-auto">
        <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">Budget moyen</span>
            <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-primary">{props.average_daily_cost}€</span>
                <span className="text-xs text-gray-500">/ jour</span>
            </div>
        </div>
        
        <Link href={`/destinations/${props.id}`}>
            <Button size="sm" className="h-9 rounded-full px-5 text-sm font-semibold shadow-sm">
                Explorer
            </Button>
        </Link>
      </CardFooter>
      
    </Card>
  );
}
