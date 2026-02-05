import React from "react";
import Link from "next/link";
import { Models, Query } from "appwrite";
import { Question } from "@/models/types";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";

interface QuestionCardProps {
    question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
    const [votes, setVotes] = React.useState<Models.Document[]>([]);

    React.useEffect(() => {
        const fetchVotes = async () => {
            try {
                const response = await databases.listDocuments(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.votes,
                    [
                        Query.equal("typeId", question.$id),
                        Query.equal("typeType", "question"),
                    ]
                );
                setVotes(response.documents);
            } catch (error) {
                console.error("Failed to fetch votes:", error);
            }
        };

        fetchVotes();
    }, [question.$id]);

    const upvotes = votes.filter((vote) => vote.type === "up").length;
    const downvotes = votes.filter((vote) => vote.type === "down").length;
    const score = upvotes - downvotes;

    return (
        <div className="flex flex-col gap-4 border-b p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
                <Link href={`/questions/${question.$id}`} className="flex-1">
                    <h3 className="text-xl font-semibold text-primary hover:text-primary/80 line-clamp-2">
                        {question.title}
                    </h3>
                </Link>
            </div>

            <div className="flex flex-wrap gap-2">
                {question.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                    <Link
                        key={tag}
                        href={`/tags/${tag}`}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                        {tag}
                    </Link>
                ))}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{score} votes</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>Answers</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span>Asked {new Date(question.$createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}
