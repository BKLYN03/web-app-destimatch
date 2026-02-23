import { API_URL } from '../lib/config';
import { Review } from '@/models/review';

export async function getReviewsForDestination(destinationId: string): Promise<Review[]> {
    try {
        const res = await fetch(`${API_URL}/destinations/${destinationId}/reviews`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("destimatch_token")}`
            }
        });
        
        if (!res.ok) {
            throw new Error("Erreur");
        }
        return await res.json();
    } catch (error) {
        console.error("Erreur:", error);
        return [];
    }
}

export async function addReview(destinationId: string, rating: number, content: string) {
    await fetch(`${API_URL}/destinations/${destinationId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("destimatch_token")}`
        },
        body: JSON.stringify({ rating, content })
    })
}
