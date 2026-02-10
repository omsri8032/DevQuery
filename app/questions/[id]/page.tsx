"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { databases, avatars } from "@/lib/appwrite";
import env from "@/lib/env";
import { Question, Answer } from "@/models/types";
import { Query, ID } from "appwrite";
import RTE from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badge/badge";
import { useAuthStore } from "@/store/useAuthStore";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useThemeStore } from "@/store/useThemeStore";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Image from "next/image";

const MarkdownPreview = dynamic(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    { ssr: false }
);

export default function QuestionDetails() {
    const { id } = useParams();
    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [newAnswer, setNewAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuthStore();
    const { theme } = useThemeStore();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Fetch Question
                const q = await databases.getDocument(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.questions,
                    id as string
                );
                setQuestion(q as unknown as Question);

                // Fetch Answers
                const a = await databases.listDocuments(
                    env.appwrite.databaseId,
                    env.appwrite.collectionIds.answers,
                    [Query.equal("questionId", id as string), Query.orderDesc("$createdAt")]
                );
                setAnswers(a.documents as unknown as Answer[]);

            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [id]);

    const handleAnswerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("Please login to answer");
        if (!newAnswer.trim()) return;

        setIsSubmitting(true);
        try {
            const payload = {
                content: newAnswer,
                questionId: id as string,
                authorId: user.$id,
            };

            const response = await databases.createDocument(
                env.appwrite.databaseId,
                env.appwrite.collectionIds.answers,
                ID.unique(),
                payload
            );

            setAnswers([response as unknown as Answer, ...answers]);
            setNewAnswer("");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="container flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">Login Required</h1>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                        You need to be logged in to view question details and answers.
                        Join our community to share knowledge!
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button color="secondary" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                    <Button color="primary" onClick={() => router.push("/login")}>
                        Login to Continue
                    </Button>
                </div>
            </div>
        );
    }

    if (!question) return <div className="container py-10">Loading...</div>;

    return (
        <div className="container max-w-5xl py-10 px-4 space-y-16">
            <div className="flex justify-start">
                <Button color="tertiary" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>
            {/* Question Section */}
            <div className="flex gap-6">
                <VoteButtons type="question" id={question.$id} upvotes={0} downvotes={0} />
                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-bold break-words text-neutral-900 dark:text-neutral-50">{question.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-4">
                        <Image src="/icons/calendar.png" alt="Date" width={16} height={16} className="object-contain" />
                        Asked {new Date(question.$createdAt).toLocaleDateString()}
                    </div>

                    <div data-color-mode={theme === "dark" ? "dark" : "light"} className="prose dark:prose-invert max-w-none border-b border-neutral-200 dark:border-neutral-800 pb-8">
                        <MarkdownPreview source={question.content} style={{ backgroundColor: 'transparent' }} />
                    </div>

                    <div className="flex gap-2 pt-4 flex-wrap">
                        {question.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean).map((tag: string) => (
                            <Badge key={tag} color="gray" size="md">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Answers Section */}
            <div className="space-y-8">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-neutral-500" />
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{answers.length} Answers</h2>
                </div>

                {answers.map(answer => (
                    <div key={answer.$id} className="flex gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-8">
                        <VoteButtons type="answer" id={answer.$id} upvotes={0} downvotes={0} />
                        <div className="flex-1 space-y-4">
                            <div data-color-mode={theme === "dark" ? "dark" : "light"} className="prose dark:prose-invert max-w-none">
                                <MarkdownPreview source={answer.content} style={{ backgroundColor: 'transparent' }} />
                            </div>
                            <div className="text-xs text-neutral-400 text-right">
                                Answered {new Date(answer.$createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Answer Form */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Your Answer</h3>
                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                    <div className="rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden">
                        <RTE value={newAnswer} onChange={(val) => setNewAnswer(val || "")} />
                    </div>
                    <Button type="submit" disabled={isSubmitting} color="primary" isLoading={isSubmitting}>
                        Post Answer
                    </Button>
                </form>
            </div>
        </div>
    );
}
