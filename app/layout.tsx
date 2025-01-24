import "@ant-design/v5-patch-for-react-19";
import { SWRProvider } from "@/lib/fetchData";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { Geist, Geist_Mono } from "next/font/google";
import AntdRegistryProvider from "@/components/AntdRegistry";
import type { Metadata } from "next";
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
  title: "ESPx",
  description: "ESPx - Stock Insights and Portfolio Management",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.className} ${geistMono.className}`}
    >
      <body>
        <AntdRegistryProvider>
          <LoadingProvider>
            <ErrorProvider>
              <SWRProvider>{children}</SWRProvider>
            </ErrorProvider>
          </LoadingProvider>
        </AntdRegistryProvider>
      </body>
    </html>
  );
}
