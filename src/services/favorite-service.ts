import { API_URL } from "@/lib/config";
import { Favorite } from "@/models/favorite";

const FAV_URL = `${API_URL}/favorites`;

export async function getMostLikedContinents(): Promise<string[]> {
    const res = await fetch(`${FAV_URL}/most-liked-continents`);
    
    if (!res.ok) {
        console.error("Erreur chargement top continents");
        return [];
    }
    
    return await res.json();
}

export async function getUserFavorites(): Promise<Favorite[]> {
    const res = await fetch(FAV_URL, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("destimatch_token")}`
        },
    })

    return res.json();
}

export async function addToFavorites(destination_id: string) {
    const res = await fetch(`${FAV_URL}?destination_id=${destination_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("destimatch_token")}`
        },
    })

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error_message);
    }        

    return true;
}

export async function removeFromFavorites(destination_id: string) {
    const res = await fetch(`${FAV_URL}?destination_id=${destination_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("destimatch_token")}`
        },
    })

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error_message);
    }        

    return true;
}
