import { Models } from "appwrite";

export interface UserPrefs extends Models.Preferences {
    reputation: number;
    bio: string;
}

export interface Question extends Models.Document {
    title: string;
    content: string;
    authorId: string;
    tags: string;
    attachmentId?: string;
}

export interface Answer extends Models.Document {
    content: string;
    questionId: string;
    authorId: string;
}

export interface Vote extends Models.Document {
    type: "up" | "down";
    typeId: string;
    typeType: "question" | "answer";
    votedById: string;
}
