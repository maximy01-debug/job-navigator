import type { Metadata } from "next";
import "./globals.css";
import { FloatingLogo } from "@/components/layout/floating-logo";

export const metadata: Metadata = {
  title: "Job Navigator - 특성화고 취업 로드맵",
  description: "특성화고 학생들을 위한 3년 취업 로드맵 관리 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <FloatingLogo />
        {children}
      </body>
    </html>
  );
}
