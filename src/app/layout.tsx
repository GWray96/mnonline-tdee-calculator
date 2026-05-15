import type { Metadata } from "next";
import { Bebas_Neue, Barlow, Barlow_Condensed } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

const GA_ID = "G-49JF1NJNJ3";
const GSC_VERIFICATION = "4_7ShZ6c0jZItRaPgPzD189vXGF-qtr7mhCIATHU5L0";

export const metadata: Metadata = {
  title: "MNONLINE | Free Calorie Calculator",
  description: "Find out exactly how many calories you need. Get your personalised daily calorie target and macros in 60 seconds.",
  verification: { google: GSC_VERIFICATION },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${barlow.variable} ${barlowCondensed.variable} antialiased font-sans`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId={GA_ID} />
    </html>
  );
}
