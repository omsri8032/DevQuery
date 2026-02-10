"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ID } from "appwrite";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";
import { useAuthStore } from "@/store/useAuthStore";
import RTE from "@/components/RTE";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/ui/label"; // Keep Label for RTE

export default function AskQuestion() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuthStore();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user, router]);

    // Don't render form until user is authenticated
    if (!user) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("You must be logged in to ask a question");

        setIsLoading(true);

        try {
            await databases.createDocument(
                env.appwrite.databaseId,
                env.appwrite.collectionIds.questions,
                ID.unique(),
                {
                    title,
                    content,
                    authorId: user.$id,
                    tags: tags.trim().substring(0, 50),
                    createdDate: new Date().toISOString(),
                    updatedDate: new Date().toISOString(),
                }
            );

            router.push("/");
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to create question");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-neutral-50">Ask a Question</h1>
            <form onSubmit={handleSubmit} className="space-y-6">

                <Input
                    label="Title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                    hint="Be specific and imagine you're asking a question to another person."
                    isRequired
                />

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Detailed Explanation <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                        Introduce the problem and expand on what you put in the title.
                    </p>
                    <div className="rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden">
                        <RTE value={content} onChange={(value) => setContent(value || "")} />
                    </div>
                </div>

                <Input
                    label="Tags"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. (r, html, css)"
                    hint="Add up to 5 tags to describe what your question is about. Separated by comma."
                    isRequired
                />

                <div className="pt-4">
                    <Button type="submit" disabled={isLoading} color="primary" size="lg" isLoading={isLoading}>
                        Post Your Question
                    </Button>
                </div>
            </form>
        </div>
    );
}
