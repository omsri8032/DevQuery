"use client";

import Link from "next/link";
import Image from "next/image";
import { IconHome, IconTag, IconUser, IconSparkles, IconCode, IconUsers, IconWorld, IconRocket, IconBrain } from "@tabler/icons-react";
import { Spotlight } from "@/components/ui/spotlight";
import { FlipWords } from "@/components/ui/flip-words";
import { Meteors } from "@/components/ui/meteors";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/base/buttons/button";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function LandingPageContent() {
    const words = ["innovative", "powerful", "collaborative", "intelligent"];

    const features = [
        {
            title: "Knowledge Discovery",
            description: "Tap into a vast shared brain of developer knowledge and solutions.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"><Image src="/feature-ai.png" alt="Knowledge Discovery" width={500} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>,
            icon: <IconBrain className="h-4 w-4 text-neutral-500" />,
        },
        {
            title: "Vibrant Community",
            description: "Connect with thousands of developers sharing knowledge together.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"><Image src="/feature-community.png" alt="Community" width={500} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>,
            icon: <IconUsers className="h-4 w-4 text-neutral-500" />,
        },
        {
            title: "Global Reach",
            description: "Access expertise from developers across the globe, 24/7.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"><Image src="/feature-global.png" alt="Global Reach" width={500} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>,
            icon: <IconWorld className="h-4 w-4 text-neutral-500" />,
        },
        {
            title: "Code Excellence",
            description: "Share and review code with syntax highlighting and formatting.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"><Image src="/feature-code.png" alt="Code Excellence" width={500} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>,
            icon: <IconCode className="h-4 w-4 text-neutral-500" />,
        },
        {
            title: "Blazing Fast",
            description: "Experience zero-latency navigation powered by Next.js edge performance.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"><Image src="/feature-fast.png" alt="Fast Performance" width={500} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>,
            icon: <IconRocket className="h-4 w-4 text-neutral-500" />,
        },
        {
            title: "Quality Content",
            description: "Upvote system ensures the best answers rise to the top.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"><Image src="/feature-quality.png" alt="Quality Content" width={500} height={300} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>,
            icon: <IconSparkles className="h-4 w-4 text-neutral-500" />,
        },
    ];

    return (
        <div className="bg-white dark:bg-neutral-950 min-h-screen font-sans">
            {/* Background Beams - Dark mode only */}
            <div className="hidden dark:block">
                <BackgroundBeams className="fixed top-0 left-0 w-full h-full z-0" />
            </div>

            <div className="relative z-10 flex flex-col gap-20 pb-20">
                {/* Hero Section */}
                <div className="h-[40rem] w-full flex md:items-center md:justify-center bg-white dark:bg-black/[0.96] antialiased bg-grid-black/[0.05] dark:bg-grid-white/[0.02] relative overflow-hidden">
                    <Spotlight
                        className="-top-40 left-0 md:left-60 md:-top-20 hidden dark:block"
                        fill="white"
                    />
                    <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
                        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50">
                            Build something <br />
                            <FlipWords words={words} className="text-primary dark:text-primary" />
                        </h1>
                        <p className="mt-4 font-normal text-base text-neutral-600 dark:text-neutral-300 max-w-lg text-center mx-auto">
                            Join a community of developers sharing knowledge, solving problems, and building the future together.
                        </p>
                        <div className="flex justify-center mt-8 gap-4">
                            <Link href="/register">
                                <Button size="2xl" color="primary" className="rounded-full">
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="2xl" color="secondary" className="rounded-full">
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-5xl mx-auto px-8">
                    <h2 className="text-3xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 mb-12 text-center">
                        Everything You Need
                    </h2>
                    <BentoGrid>
                        {features.map((feature, i) => (
                            <BentoGridItem
                                key={i}
                                title={feature.title}
                                description={feature.description}
                                header={feature.header}
                                icon={feature.icon}
                                className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                            />
                        ))}
                    </BentoGrid>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto w-full px-8">
                    <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-12 text-center overflow-hidden">
                        <div className="hidden dark:block">
                            <Meteors number={20} />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
                                Ready to join the community?
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                                Start asking questions and sharing your expertise today. It's completely free!
                            </p>
                            <Link
                                href="/register"
                                className="inline-block px-8 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                            >
                                Create Free Account
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
