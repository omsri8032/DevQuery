import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Models, Query } from "appwrite";
import { Question } from "@/models/types";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";
import { Badge } from "@/components/base/badge/badge";

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

    const upvotes = votes.filter((vote: any) => vote.type === "up").length;
    const downvotes = votes.filter((vote: any) => vote.type === "down").length;
    const score = upvotes - downvotes;

    return (
        <div className="group relative bg-white dark:bg-neutral-900/50 shadow-sm hover:shadow-md transition-all rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700">
            <div className="p-6">

                <div className="flex items-start justify-between mb-3">
                    <Link href={`/questions/${question.$id}`} className="flex-1">
                        <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary dark:text-neutral-50 transition-colors">
                            {question.title}
                        </h3>
                    </Link>

                    <div className="flex items-center gap-4 ml-4 shrink-0">
                        <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 rounded">
                            <Image src="/icons/elections.png" alt="Votes" width={20} height={20} className="opacity-70" />
                            <span className="font-bold text-neutral-900 dark:text-neutral-50">{score}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 rounded">
                            <Image src="/icons/correct.png" alt="Answers" width={20} height={20} className="opacity-70" />
                            <span className="font-bold text-neutral-900 dark:text-neutral-50">0</span>
                        </div>
                    </div>
                </div>

                <p className="mb-4 line-clamp-2 text-neutral-600 dark:text-neutral-400">
                    {question.content}
                </p>


                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex flex-wrap gap-2">
                        {question.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                <Image src="/icons/tag.png" alt="" width={16} height={16} className="opacity-60" />
                                {tag}
                            </span>
                        ))}
                    </div>

                    <span className="text-xs text-neutral-400 shrink-0 ml-4">
                        {new Date(question.$createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
