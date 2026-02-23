import { BudgetLevel } from '../lib/budget-level';
import { TravelStyle } from '../lib/travel-style';
import { Location } from '../lib/location';

export interface User {
    id?: string;
    name: string;
    email: string;
    // phone: string;
    location?: Location;
    roles: string[];
    preferences: string[];
    travel_style?: TravelStyle;
    budget_level?: BudgetLevel;
    favorite_continents?: string[];
}
