"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";
import { Query } from "appwrite";
import { Question } from "@/models/types";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/base/buttons/button";

export default function TagPage() {
    const { tag } = useParams();
    const decodedTag = tag ? decodeURIComponent(tag as string) : "";
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!decodedTag) return;

        const fetchQuestions = async () => {
            try {
                const response = await databases.listDocuments(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.questions,
                    [
                        Query.orderDesc("$createdAt"),
                        Query.search("tags", decodedTag)
                    ]
                );
                setQuestions(response.documents as unknown as Question[]);
            } catch (error) {
                console.error("Failed to fetch questions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, [decodedTag]);

    return (
        <div className="container py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Questions tagged [{decodedTag}]</h1>
                <Link href="/questions/ask">
                    <Button color="primary">Ask Question</Button>
                </Link>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        <p>Loading questions...</p>
                    </div>
                ) : questions.length > 0 ? (
                    questions.map((question) => (
                        <QuestionCard key={question.$id} question={question} />
                    ))
                ) : (
                    <div className="text-center py-10 bg-muted/50 rounded-lg">
                        <h3 className="text-lg font-medium">No questions found</h3>
                        <p className="text-muted-foreground mt-2">
                            There are no questions with the tag <strong>{decodedTag}</strong> yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
