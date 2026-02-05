"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { databases, avatars } from "@/lib/appwrite";
import env from "@/lib/env";
import { Question, Answer } from "@/models/types";
import { Query, ID } from "appwrite";
import RTE from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useThemeStore } from "@/store/useThemeStore";

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

    if (!question) return <div className="container py-10">Loading...</div>;

    return (
        <div className="container max-w-5xl py-10 space-y-16">
            <div className="flex justify-start">
                <Button variant="outline" onClick={() => window.history.back()}>
                    &larr; Back
                </Button>
            </div>
            {/* Question Section */}
            <div className="flex gap-6">
                <VoteButtons type="question" id={question.$id} upvotes={0} downvotes={0} />
                <div className="flex-1 space-y-4">
                    <h1 className="text-3xl font-bold break-words">{question.title}</h1>
                    <div className="text-sm text-muted-foreground mb-4">
                        Asked {new Date(question.$createdAt).toLocaleDateString()}
                    </div>

                    <div data-color-mode={theme === "dark" ? "dark" : "light"} className="prose dark:prose-invert max-w-none border-b pb-8">
                        <MarkdownPreview source={question.content} style={{ backgroundColor: 'transparent' }} />
                    </div>

                    <div className="flex gap-2 pt-4">
                        {question.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean).map((tag: string) => (
                            <span key={tag} className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Answers Section */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold">{answers.length} Answers</h2>

                {answers.map(answer => (
                    <div key={answer.$id} className="flex gap-6 border-b pb-8">
                        <VoteButtons type="answer" id={answer.$id} upvotes={0} downvotes={0} />
                        <div className="flex-1 space-y-4">
                            <div data-color-mode={theme === "dark" ? "dark" : "light"} className="prose dark:prose-invert max-w-none">
                                <MarkdownPreview source={answer.content} style={{ backgroundColor: 'transparent' }} />
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                                Answered {new Date(answer.$createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Answer Form */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Your Answer</h3>
                <form onSubmit={handleAnswerSubmit} className="space-y-4">
                    <RTE value={newAnswer} onChange={(val) => setNewAnswer(val || "")} />
                    <Button disabled={isSubmitting}>
                        {isSubmitting ? "Posting..." : "Post Answer"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
