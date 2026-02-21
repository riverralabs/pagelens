import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { QueryProvider } from "@/components/layout/query-provider";

export const metadata: Metadata = {
  title: {
    default: "PageLens - AI-Powered Website Analysis",
    template: "%s | PageLens",
  },
  description: "See What Your Visitors See. Fix What They Don't. AI-powered website analysis across visual design, copywriting, UX, conversion, SEO, and image quality.",
  keywords: ["website analysis", "AI", "UX audit", "SEO", "conversion optimization"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
