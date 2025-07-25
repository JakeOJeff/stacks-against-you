// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Silk from "@/components/Silk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stacks Against You",
  description: "Privacy Focused",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950`}
      >
        {/* Persistent Silk Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Silk
            speed={5}
            scale={1}
            color="#1b2436"
            noiseIntensity={.5}
            rotation={0}
          />
        </div>

        {/* Page Transitions */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
