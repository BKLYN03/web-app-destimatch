import { Location } from '@/lib/location';
import { API_URL } from '../lib/config';

const USER_API_URL = `${API_URL}/users`;

export async function login(email: string, password: string) {
    const res = await fetch(`${USER_API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.log("Détails de l'erreur :", errorData);
        throw new Error(errorData.error_message || "Erreur lors de l'authentification");
    }

    const data = await res.json();
    if (data.token)
        localStorage.setItem("destimatch_token", data.token);
    if (data.user)
        localStorage.setItem("destimatch_user", JSON.stringify(data.user));
    
    return data;
}

export async function register(name: string, email: string, password: string, location: Location) {
    const res = await fetch(`${USER_API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
            location
        })
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error_message);
    }

    const data = await res.json();
    if (data.token)
        localStorage.setItem("destimatch_token", data.token);
    if (data.user)
        localStorage.setItem("destimatch_user", JSON.stringify(data.user));

    return data;
}

export async function updateUserPreferences(travelStyle: string, budgetLevel: string, favoriteContinents: string[], tags: string[]) {
    const res = await fetch(`${USER_API_URL}/preferences`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("destimatch_token")}`
        },
        body: JSON.stringify({
            tags,
            "travel_style": travelStyle,
            "budget_level": budgetLevel,
            favoriteContinents,
        })
    })

    if (!res.ok) {
        const errorData = await res.json();
        console.log("Détails de l'erreur :", errorData);
        throw new Error(errorData.error_message);
    }

    const data = await res.json();
    if (localStorage.getItem("destimatch_user"))
        localStorage.removeItem("destimatch_user");
    localStorage.setItem("destimatch_user", JSON.stringify(data));
}
