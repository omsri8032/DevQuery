"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";
import { Query } from "appwrite";
import { Question } from "@/models/types";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/base/buttons/button";
import { useSearchParams } from "next/navigation";

import { FlipWords } from "@/components/ui/flip-words";


import { useAuthStore } from "@/store/useAuthStore";
import { LandingPageContent } from "@/components/LandingPageContent";

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const words = ["knowledge", "ideas", "solutions", "insights"];

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queries = [Query.orderDesc("$createdAt"), Query.limit(10)];

        if (search) {
          queries.push(Query.search("title", search));
        }

        const response = await databases.listDocuments(
          env.appwrite.databaseId,
          env.appwrite.collectionIds.questions,
          queries
        );
        setQuestions(response.documents as unknown as Question[]);
      } catch (error: any) {
        console.error("Failed to fetch questions:", error);
        setError(error.message || "Failed to load questions");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchQuestions();
    }
  }, [search, user]);

  if (!user) {
    return <LandingPageContent />;
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-neutral-950 w-full overflow-hidden font-sans">



      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">

        <div className="max-w-5xl mx-auto" id="questions">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Top Questions
            </h2>
            <Link href="/questions/ask">
              <Button color="secondary" className="rounded-none gap-2">
                <Image src="/icons/question (1).png" alt="" width={18} height={18} />
                Ask Question
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {error ? (
              <div className="p-4 rounded-md bg-destructive/15 text-destructive border border-destructive/20 relative z-20">
                <h3 className="font-semibold">Error Loading Questions</h3>
                <p>{error}</p>
                {error.includes("index") && (
                  <p className="mt-2 text-sm text-foreground">
                    <strong>Developer Check:</strong> You need to create a {" "}
                    <code>Fulltext</code> index on attribute <code>title</code> in
                    your Appwrite <code>questions</code> collection.
                  </p>
                )}
              </div>
            ) : isLoading ? (
              <div className="space-y-4">
                <p className="text-neutral-500 dark:text-neutral-400 text-center">Loading questions...</p>
              </div>
            ) : questions.length > 0 ? (
              questions.map((question) => (
                <div key={question.$id} className="relative z-20 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-sm dark:shadow-none">
                  <QuestionCard question={question} />
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">No questions yet</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">
                  Be the first to ask a question!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="bg-white dark:bg-neutral-950 min-h-screen"></div>}>
      <HomeContent />
    </Suspense>
  );
}
