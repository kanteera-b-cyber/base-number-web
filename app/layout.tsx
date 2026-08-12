import type { Metadata } from "next";
import { Noto_Sans_Thai, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["latin", "thai"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hb-basenumber.vercel.app"),
  title: "base-number | ระบบเลขฐาน 2, 8, 10, 16",
  description: "เว็บไซต์เรียนรู้ระบบเลขฐาน - ศึกษาเลขฐาน 2, 8, 10, 16 ด้วยวิธีคิด การบวก ลบ และการแปลงอย่างละเอียด พร้อมตัวอย่างฝึกหัด",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
