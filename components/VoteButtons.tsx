"use client";

import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { ID, Query, Models } from "appwrite";
import { cn } from "@/components/ui/button";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface VoteButtonsProps {
    type: "question" | "answer";
    id: string;
    upvotes: number; // Placeholder for now
    downvotes: number; // Placeholder for now
    className?: string;
}

export default function VoteButtons({
    type,
    id,
    upvotes = 0,
    downvotes = 0,
    className,
}: VoteButtonsProps) {
    const [votes, setVotes] = useState<Models.Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const fetchVotes = async () => {
            try {
                const response = await databases.listDocuments(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.votes,
                    [
                        Query.equal("typeId", id),
                        Query.equal("typeType", type),
                    ]
                );
                setVotes(response.documents);
            } catch (error) {
                console.error("Failed to fetch votes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVotes();
    }, [id, type]);

    const currentVote = user ? votes.find((vote) => vote.votedById === user.$id) : null;
    const upvotesCount = votes.filter((vote) => vote.type === "up").length;
    const downvotesCount = votes.filter((vote) => vote.type === "down").length;
    const totalScore = upvotesCount - downvotesCount;

    const handleVote = async (voteType: "up" | "down") => {
        if (!user) return router.push("/login");

        try {
            if (currentVote) {
                // If clicked same vote, toggle off (delete)
                if (currentVote.type === voteType) {
                    await databases.deleteDocument(
                        env.appwrite.databaseId,
                        env.appwrite.collectionIds.votes,
                        currentVote.$id
                    );
                    setVotes((prev) => prev.filter((v) => v.$id !== currentVote.$id));
                }
                // If clicked different vote, switch (delete old, create new)
                else {
                    await databases.deleteDocument(
                        env.appwrite.databaseId,
                        env.appwrite.collectionIds.votes,
                        currentVote.$id
                    );

                    const newVote = await databases.createDocument(
                        env.appwrite.databaseId,
                        env.appwrite.collectionIds.votes,
                        ID.unique(),
                        {
                            type: voteType,
                            typeId: id,
                            typeType: type,
                            votedById: user.$id,
                        }
                    );

                    setVotes((prev) => [
                        ...prev.filter((v) => v.$id !== currentVote.$id),
                        newVote,
                    ]);
                }
            } else {
                // Create new vote
                const newVote = await databases.createDocument(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.votes,
                    ID.unique(),
                    {
                        type: voteType,
                        typeId: id,
                        typeType: type,
                        votedById: user.$id,
                    }
                );
                setVotes((prev) => [...prev, newVote]);
            }
        } catch (error) {
            console.error("Vote failed:", error);
        }
    };

    return (
        <div className={cn("flex flex-col items-center gap-1", className)}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote("up")}
                className={cn(currentVote?.type === "up" && "text-orange-500")}
            >
                <ArrowBigUp className={cn("h-8 w-8", currentVote?.type === "up" ? "fill-current" : "")} />
            </Button>

            <span className="text-lg font-semibold">{totalScore}</span>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVote("down")}
                className={cn(currentVote?.type === "down" && "text-red-500")}
            >
                <ArrowBigDown className={cn("h-8 w-8", currentVote?.type === "down" ? "fill-current" : "")} />
            </Button>
        </div>
    );
}
