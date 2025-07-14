export interface Product {
    category: string | undefined;
    tag: string | undefined;
    id: number;
    image: string;
    rating: number;
    reviews: number;
    title: string;
    price: string;
    currency: string;
}