"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
    words,
    duration = 3000,
    className,
}: {
    words: string[];
    duration?: number;
    className?: string;
}) => {
    const [currentWord, setCurrentWord] = React.useState(words[0]);
    const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

    const startAnimation = React.useCallback(() => {
        const currentIndex = words.indexOf(currentWord);
        const nextIndex = (currentIndex + 1) % words.length;
        setCurrentWord(words[nextIndex]);
        setIsAnimating(true);
    }, [currentWord, words]);

    React.useEffect(() => {
        if (!isAnimating) {
            const timer = setTimeout(() => {
                startAnimation();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isAnimating, duration, startAnimation]);

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.4,
                ease: "easeInOut",
                type: "spring",
                stiffness: 100,
                damping: 10,
            }}
            className={cn(
                "z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100",
                className
            )}
        >
            <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                }}
                onAnimationComplete={() => setIsAnimating(false)}
                className="inline-block"
            >
                {currentWord.split("").map((letter, index) => (
                    <motion.span
                        key={currentWord + index}
                        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                            delay: index * 0.08,
                            duration: 0.4,
                        }}
                        className="inline-block"
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.span>
        </motion.div>
    );
};
