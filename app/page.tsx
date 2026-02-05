"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { databases } from "@/lib/appwrite";
import env from "@/lib/env";
import { Query } from "appwrite";
import { Question } from "@/models/types";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "framer-motion";

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchQuestions();
  }, [search]);

  return (
    <div className="space-y-6">
      <HeroHighlight containerClassName="h-[20rem] rounded-md mb-10">
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          Ask questions. Get answers.
          <br />
          <Highlight className="text-black dark:text-white">
            Share your knowledge.
          </Highlight>
        </motion.h1>
      </HeroHighlight>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Top Questions</h1>
        <Link href="/questions/ask">
          <Button>Ask Question</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {error ? (
          <div className="p-4 rounded-md bg-destructive/15 text-destructive border border-destructive/20">
            <h3 className="font-semibold">Error Loading Questions</h3>
            <p>{error}</p>
            {error.includes("index") && (
              <p className="mt-2 text-sm text-foreground">
                <strong>Developer Check:</strong> You need to create a{" "}
                <code>Fulltext</code> index on attribute <code>title</code> in
                your Appwrite <code>questions</code> collection.
              </p>
            )}
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <p>Loading questions...</p>
          </div>
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question.$id} question={question} />
          ))
        ) : (
          <div className="text-center py-10 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-medium">No questions yet</h3>
            <p className="text-muted-foreground mt-2">
              Be the first to ask a question!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
