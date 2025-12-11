import type { Metadata } from "next";
import Providers from "./providers";
import SidebarWrapper from "./components/SidebarWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flashcard Tiếng Trung",
  description: "Học tiếng Trung hiệu quả",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-900 text-white">
          <Providers>
            <SidebarWrapper>{children}</SidebarWrapper>
          </Providers>
      </body>
    </html>
  );
}
