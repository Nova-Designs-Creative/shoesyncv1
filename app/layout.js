"use client";

import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap everything in SessionProvider */}
        <SessionProvider>
          <div className="layout-container">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
