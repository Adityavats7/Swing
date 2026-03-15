import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buyer Web",
  description: "Quick commerce buyer app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}