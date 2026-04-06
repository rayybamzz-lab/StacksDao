import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StacksDAO - NFT Staking & Governance",
  description: "The first decentralized protocol on Stacks enabling yield generation through NFT staking and multi-tier governance.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://stacksdao.io",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stacksdao.io",
    siteName: "StacksDAO",
    title: "StacksDAO - NFT Staking & Governance",
    description: "The first decentralized protocol on Stacks enabling yield generation through NFT staking and multi-tier governance.",
  },
};

import { StacksProvider } from '@/lib/StacksProvider';
import { Toaster } from 'react-hot-toast';

/**
 * RootLayout
 * Functional UI component / utility
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StacksProvider>
          {children}
          <Toaster position="bottom-right" />
        </StacksProvider>
      </body>
    </html>
  );
}

