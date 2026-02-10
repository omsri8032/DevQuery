"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";
import { Query } from "appwrite";
import { Question } from "@/models/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";

export default function ProfilePage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [myQuestions, setMyQuestions] = useState<Question[]>([]);
    const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
    const [answerCount, setAnswerCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            // Redirect or show empty state
            return;
        }

        const fetchMyContent = async () => {
            try {
                const questions = await databases.listDocuments(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.questions,
                    [
                        Query.equal("authorId", user.$id),
                        Query.orderDesc("$createdAt"),
                        Query.limit(10)
                    ]
                );
                setMyQuestions(questions.documents as unknown as Question[]);

                // Fetch answers by this user
                const answers = await databases.listDocuments(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.answers,
                    [
                        Query.equal("authorId", user.$id),
                        Query.orderDesc("$createdAt"),
                        Query.limit(10)
                    ]
                );
                setAnswerCount(answers.total);

                // Fetch the questions for these answers
                const questionIds = answers.documents.map((answer: any) => answer.questionId);
                const uniqueQuestionIds = [...new Set(questionIds)];

                if (uniqueQuestionIds.length > 0) {
                    const questionsForAnswers = await databases.listDocuments(
                        env.appwrite.databaseId,
                        env.appwrite.collectionIds.questions,
                        [
                            Query.equal("$id", uniqueQuestionIds),
                            Query.limit(10)
                        ]
                    );
                    setAnsweredQuestions(questionsForAnswers.documents as unknown as Question[]);
                }
            } catch (error) {
                console.error("Failed to fetch profile content:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyContent();
    }, [user]);

    if (!user) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-50">Please Log In</h1>
                <p className="mb-6 text-neutral-500 dark:text-neutral-400">You need to be logged in to view your profile.</p>
                <Link href="/login">
                    <Button color="primary">Log In</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container max-w-5xl py-10 space-y-12">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-neutral-200 dark:border-neutral-800 pb-12">
                <Avatar
                    src={(user.prefs as any)?.avatar}
                    alt={user.name}
                    fallback={user.name.charAt(0)}
                    size="2xl"
                />
                <div className="text-center md:text-left space-y-4 flex-1">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{user.name}</h1>
                        <p className="text-neutral-500 dark:text-neutral-400">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-lg">
                            <span className="block text-xl font-bold text-neutral-900 dark:text-neutral-50">{myQuestions.length}</span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Questions</span>
                        </div>
                        {/* Answers Count */}
                        <div className="bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-lg">
                            <span className="block text-xl font-bold text-neutral-900 dark:text-neutral-50">{answerCount}</span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Answers</span>
                        </div>
                    </div>
                </div>
                <Button color="secondary" onClick={() => router.push("/settings")}>
                    Edit Profile
                </Button>
            </div>

            {/* My Questions */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">My Recent Questions</h2>
                    <Link href="/questions/ask">
                        <Button color="primary" size="sm">Ask New Question</Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div>Loading activity...</div>
                ) : myQuestions.length > 0 ? (
                    <div className="grid gap-6">
                        {myQuestions.map((q) => (
                            <QuestionCard key={q.$id} question={q} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <p className="text-neutral-500 dark:text-neutral-400 mb-4">You haven't asked any questions yet.</p>
                        <Button color="tertiary" onClick={() => router.push("/questions/ask")}>Start Contributing</Button>
                    </div>
                )}
            </div>

            {/* Questions I've Answered */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Questions I've Answered</h2>

                {isLoading ? (
                    <div>Loading...</div>
                ) : answeredQuestions.length > 0 ? (
                    <div className="grid gap-6">
                        {answeredQuestions.map((q) => (
                            <QuestionCard key={q.$id} question={q} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <p className="text-neutral-500 dark:text-neutral-400 mb-4">You haven't answered any questions yet.</p>
                        <Button color="tertiary" onClick={() => router.push("/")}>Browse Questions</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
