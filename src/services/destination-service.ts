import { BudgetLevel } from '@/lib/budget-level';
import { API_URL } from '../lib/config';
import { Destination } from '@/models/destination';
import { TravelStyle } from '@/lib/travel-style';
import { Location } from '@/lib/location';
import { matchContinent } from '@/lib/utils';

const DEST_API_URL = `${API_URL}/destinations`;

export interface DestinationMatch {
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
  match_score: number;
}

export interface SearchParams {
    q?: string | null;
    continent?: string | null;
    tag?: string | null;
    style?: string | null;
    budget?: string | null;
}

export default async function getAllDestinations(): Promise<Destination[]> {
  const res = await fetch(DEST_API_URL, { cache: 'no-store' });

  if (!res.ok) 
    throw new Error('Erreur lors du chargement');

  return res.json();
}

export async function getDestinationById(id: string): Promise<Destination> {
  const res = await fetch(`${DEST_API_URL}/${id}`);

  if (!res.ok) 
    throw new Error('Erreur lors du chargement');

  return res.json();
}

export async function searchDestinations(searchParams: SearchParams) {
  const params = new URLSearchParams();
    
  if (searchParams.q) 
    params.append("q", searchParams.q);
  if (searchParams.continent) 
    params.append("continent", matchContinent(searchParams.continent)!);
  if (searchParams.tag) 
    params.append("tag", searchParams.tag);
  if (searchParams.style) 
    params.append("style", searchParams.style);
  if (searchParams.budget) 
    params.append("budget", searchParams.budget);

  const res = await fetch(`${DEST_API_URL}/search?${params.toString()}`);

  if (!res.ok) 
    throw new Error("Erreur lors de la recherche");

  return res.json();
}

export async function getMatchingDestinations(): Promise<DestinationMatch[]> {
  const res = await fetch(`${DEST_API_URL}/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("destimatch_token")}`
    },
    body: JSON.stringify({})
  })

  if (!res.ok) 
    throw new Error('Erreur lors du chargement');
  
  return res.json();
}

export async function getAllTags(): Promise<string[]> {
  const res = await fetch(`${API_URL}/tags`);

  return res.json();
}
