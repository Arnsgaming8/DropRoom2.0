import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DropRoom - Anonymous File Sharing",
  description: "Simple, anonymous, room-based file sharing. No accounts, no limits.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
