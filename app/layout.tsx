import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QNA",
  description: "A Q&A platform for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 container py-6 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
              <main className="flex w-full flex-col overflow-hidden">
                {children}
              </main>
              <aside className="hidden md:block w-full">
                {/* Sidebar placeholder */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                  <h3 className="font-semibold mb-2">Right Sidebar</h3>
                  <p className="text-sm text-muted-foreground">Ad space, blog posts, or network links.</p>
                </div>
              </aside>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
