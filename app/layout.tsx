import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AuthProvider from "@/providers/AuthProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dev Query",
  description: "A Q&A platform for developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
              <Header />
              <div className="flex-1 container py-6 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
                <main className="flex w-full flex-col overflow-hidden">
                  {children}
                </main>
                <aside className="hidden md:block w-full">
                  <div className="sticky top-20">
                    <Sidebar />
                  </div>
                </aside>
              </div>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

