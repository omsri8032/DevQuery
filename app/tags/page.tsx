"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";
import { Query } from "appwrite";
import { Question } from "@/models/types";

export default function TagsPage() {
    const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                // Fetch latest questions (limit 100 to get a good spread of tags)
                const response = await databases.listDocuments(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.questions,
                    [Query.orderDesc("$createdAt"), Query.limit(100)]
                );

                const questions = response.documents as unknown as Question[];

                // Aggregate tags
                const tagMap = new Map<string, number>();
                questions.forEach(q => {
                    if (q.tags) {
                        // Handle both comma-separated string and array just in case
                        const tagList = Array.isArray(q.tags)
                            ? q.tags
                            : typeof q.tags === 'string'
                                ? q.tags.split(',')
                                : [];

                        tagList.forEach((tag: string) => {
                            const trimmed = tag.trim();
                            if (trimmed) {
                                tagMap.set(trimmed, (tagMap.get(trimmed) || 0) + 1);
                            }
                        });
                    }
                });

                // Convert to array and sort by count
                const sortedTags = Array.from(tagMap.entries())
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count);

                setTags(sortedTags);
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTags();
    }, []);

    return (
        <div className="container py-10 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
            <p className="text-muted-foreground">
                A tag is a keyword or label that categorizes your question with other, similar questions.
            </p>

            {isLoading ? (
                <div>Loading tags...</div>
            ) : tags.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {tags.map((tag) => (
                        <Link key={tag.name} href={`/tags/${tag.name}`}>
                            <div className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-muted/50 transition-colors min-w-[100px]">
                                <span className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-sm font-medium mb-2">
                                    {tag.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {tag.count} question{tag.count !== 1 && "s"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-medium">No tags found</h3>
                    <p className="text-muted-foreground mt-2">
                        Ask a question to create the first tag!
                    </p>
                </div>
            )}
        </div>
    );
}
