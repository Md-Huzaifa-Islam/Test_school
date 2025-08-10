import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Test_School - Digital Competency Assessment Platform",
  description:
    "Assess and certify your digital skills through structured competency evaluations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-secondary-50`}
      >
        <ReactQueryProvider>
          <ReduxProvider>
            <AuthProvider>
              <MainLayout>{children}</MainLayout>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    style: {
                      background: "#10b981",
                    },
                  },
                  error: {
                    style: {
                      background: "#ef4444",
                    },
                  },
                }}
              />
            </AuthProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
