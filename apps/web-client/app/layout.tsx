import type { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";

import { SiteHeader } from "@/widgets/siteHeader";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${poppins.variable} ${inter.variable}`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
