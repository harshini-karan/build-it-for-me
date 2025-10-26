import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { TRPCProvider } from "@/lib/trpc/react";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "BlogHub - Modern Blogging Platform",
  description: "A full-stack blogging platform built with Next.js, tRPC, and PostgreSQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <TRPCProvider>
          {children}
          <Toaster />
        </TRPCProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}