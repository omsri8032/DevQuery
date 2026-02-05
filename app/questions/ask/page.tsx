"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ID } from "appwrite";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";
import { useAuthStore } from "@/store/useAuthStore";
import RTE from "@/components/RTE";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AskQuestion() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuthStore();

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
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">Ask a Question</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <p className="text-xs text-muted-foreground">
                        Be specific and imagine you&apos;re asking a question to another person.
                    </p>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Detailed Explanation</Label>
                    <p className="text-xs text-muted-foreground">
                        Introduce the problem and expand on what you put in the title.
                    </p>
                    <RTE value={content} onChange={(value) => setContent(value || "")} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <p className="text-xs text-muted-foreground">
                        Add up to 5 tags to describe what your question is about. Separated by comma.
                    </p>
                    <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g. (r, html, css)"
                        required
                    />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? "Posting..." : "Post Your Question"}
                </Button>
            </form>
        </div>
    );
}
