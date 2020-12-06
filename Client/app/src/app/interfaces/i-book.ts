import { IReview } from './i-review';

export interface IBook {
    id: number;
    title: string;
    description: string;
    coverUrl: string;
    upvotes: number;
    downvotes:number;
    year: number;
    reviews: IReview[];
}