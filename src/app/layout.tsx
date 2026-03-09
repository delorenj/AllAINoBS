import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "All AI, No BS | Jarad DeLorenzo",
  description:
    "Cut through the AI hype. Practical workshops, live webinars, and 1-on-1 consulting to integrate AI workflows into your business. No fluff, just results.",
  openGraph: {
    title: "All AI, No BS | Jarad DeLorenzo",
    description:
      "Practical AI integration for teams and businesses. Workshops, webinars, and consulting.",
    url: "https://allainobs.com",
    siteName: "All AI, No BS",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
