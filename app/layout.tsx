import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UMD Metro",
  description: "Upcoming trains at the UMD stop",
};

type LayoutProps = { children: React.ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
