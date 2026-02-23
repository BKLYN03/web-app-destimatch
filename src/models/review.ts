
export interface Review {
    id?: string;
    author: string;
    user_email: string;
    destination_id: string;
    rating: number;
    content: string;
    date: string;
    aspect_sentiments?: Record<string, string>;
    ai_keywords?: string[];
}
