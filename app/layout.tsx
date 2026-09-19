import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STARKORA | Autonomous Multi-Page Website Platform",
  description:
    "Generate, customize, and publish high-converting business platforms in seconds.",
  icons: {
    icon: [
      {
        url: "/icon.png?v=5",
        type: "image/png",
      },
    ],
    shortcut: "/icon.png?v=5",
    apple: "/icon.png?v=5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-white min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}