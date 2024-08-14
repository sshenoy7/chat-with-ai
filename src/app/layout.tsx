import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'
import CustomLayout from "@/custom-layout";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GenSpark",
  description: " Where Education meets Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <CustomLayout>
            {children}
          </CustomLayout>
          </body>
      </html>
    </ClerkProvider>
  );
}
