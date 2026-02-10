"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";

export default function Sidebar() {
    const [stats, setStats] = useState({
        questions: 0,
        answers: 0,
        users: 0,
    });
    const [popularTags, setPopularTags] = useState<string[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {

                const questionsResponse = await databases.listDocuments(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.questions,
                    []
                );


                const answersResponse = await databases.listDocuments(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.answers,
                    []
                );

                setStats({
                    questions: questionsResponse.total,
                    answers: answersResponse.total,
                    users: 0,
                });


                const tagCount: Record<string, number> = {};
                questionsResponse.documents.forEach((doc: any) => {
                    if (doc.tags) {
                        const tags = doc.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
                        tags.forEach((tag: string) => {
                            tagCount[tag] = (tagCount[tag] || 0) + 1;
                        });
                    }
                });


                const sortedTags = Object.entries(tagCount)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([tag]) => tag);

                setPopularTags(sortedTags.length > 0 ? sortedTags : ["javascript", "python", "react", "typescript", "nextjs"]);
            } catch (error) {
                console.error("Failed to fetch community stats:", error);

                setPopularTags(["javascript", "python", "react", "typescript", "nextjs"]);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">

            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-4">
                <h3 className="font-semibold mb-3 text-lg">Community Stats</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Questions</span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-50">{stats.questions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Answers</span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-50">{stats.answers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">Users</span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-50">{stats.users > 0 ? stats.users.toLocaleString() : '100+'}</span>
                    </div>
                </div>
            </div>


            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 p-6 space-y-4">
                <h3 className="font-semibold mb-3 text-lg">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                        <Link
                            key={tag}
                            href={`/tags/${tag}`}
                            className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sm text-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
