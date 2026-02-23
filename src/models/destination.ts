import { BudgetLevel } from "@/lib/budget-level";
import { Location } from "@/lib/location";
import { TravelStyle } from "@/lib/travel-style";

export interface Destination {
    id: string;
    name: string;
    description: string;
    images?: string[];
    location: Location;
    official_tags: string[];
    average_daily_cost: number;
    budget_level: BudgetLevel;
    best_months: number[];
    compatible_styles: TravelStyle[];
    rating: number;
    review_count: number;
    ai_score_cleanliness?: number;
    aiScore_price?: number;
    community_tags?: string[];
}
