"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { getClientReady, getServerReady, getServerSession, getSession, logout, roleLabels, subscribeToClientReady, subscribeToSession, UserRole } from "../lib/auth";

const roleContent: Record<UserRole, { eyebrow: string; title: string; description: string; actions: { title: string; description: string; accent: string }[] }> = {
  student: { eyebrow: "พื้นที่การเรียนรู้", title: "เรียนรู้ได้ตามจังหวะของคุณ", description: "กลับไปเรียนบทเรียนเลขฐานและฝึกทำโจทย์เพื่อพัฒนาความเข้าใจ", actions: [
    { title: "เรียนต่อจากบทล่าสุด", description: "กลับไปทำความเข้าใจบทเรียนเลขฐานต่อ", accent: "bg-[#c8f169]" },
    { title: "ทำแบบฝึกหัด", description: "ฝึกบวก ลบ และแปลงเลขฐาน", accent: "bg-[#e06f52]" },
    { title: "ดูความคืบหน้า", description: "ติดตามบทเรียนที่เรียนไปแล้ว", accent: "bg-[#8dbb38]" },
  ] },
  teacher: { eyebrow: "พื้นที่สำหรับครู", title: "ดูแลการเรียนรู้ของห้องเรียน", description: "จัดการเนื้อหา สร้างแบบฝึกหัด และติดตามความก้าวหน้าของนักเรียน", actions: [
    { title: "จัดการบทเรียน", description: "วางโครงสร้างเนื้อหาให้เป็นระบบ", accent: "bg-[#c8f169]" },
    { title: "ดูผลการเรียน", description: "ติดตามพัฒนาการของนักเรียน", accent: "bg-[#e06f52]" },
    { title: "สร้างแบบฝึกหัด", description: "เพิ่มโจทย์ให้เหมาะกับแต่ละบท", accent: "bg-[#8dbb38]" },
  ] },
  admin: { eyebrow: "ศูนย์ควบคุมระบบ", title: "จัดการ base-number ทั้งระบบ", description: "ดูภาพรวมผู้ใช้งาน สิทธิ์ และการตั้งค่าของแพลตฟอร์ม", actions: [
    { title: "จัดการผู้ใช้งาน", description: "ตรวจสอบบัญชีและกำหนดสิทธิ์", accent: "bg-[#c8f169]" },
    { title: "ตรวจสอบกิจกรรม", description: "ดูการใช้งานและเหตุการณ์สำคัญ", accent: "bg-[#e06f52]" },
    { title: "ตั้งค่าระบบ", description: "ควบคุมการทำงานของแพลตฟอร์ม", accent: "bg-[#8dbb38]" },
  ] },
};

export default function DashboardPage() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const isReady = useSyncExternalStore(subscribeToClientReady, getClientReady, getServerReady);

  useEffect(() => {
    if (isReady && !session) router.replace("/login");
  }, [isReady, router, session]);

  if (!isReady || !session) return <main className="min-h-screen bg-[#101a2e]" />;

  const content = roleContent[session.role];

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#172238]">
      <nav className="flex items-center justify-between border-b border-[#ddd8cc] bg-[#fffdf8] px-5 py-4 sm:px-8">
        <Link href="/dashboard" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#101a2e] text-xl font-black text-[#c8f169]">#</span><span className="font-bold text-[#101a2e]">base-number</span></Link>
        <div className="flex items-center gap-3"><span className="hidden text-sm text-[#697386] sm:block">{session.name} · {roleLabels[session.role]}</span><button onClick={handleLogout} className="rounded-lg border border-[#ddd8cc] px-3 py-2 text-sm font-bold text-[#697386] hover:bg-white">ออกจากระบบ</button></div>
      </nav>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="rounded-[2rem] bg-[#101a2e] p-7 text-white shadow-xl shadow-[#101a2e]/15 sm:p-12"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c8f169]">{content.eyebrow}</p><h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight sm:text-5xl">สวัสดี {session.name}<br />{content.title}</h1><p className="mt-5 max-w-xl text-lg leading-8 text-[#c4ccda]">{content.description}</p></div>
        <div className="mb-4 mt-10 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e06f52]">เริ่มต้นใช้งาน</p><h2 className="mt-1 text-2xl font-black text-[#172238]">เมนูหลัก</h2></div><span className="text-sm text-[#697386]">{content.actions.length} รายการ</span></div>
        <div className="grid gap-4 md:grid-cols-3">{content.actions.map((action, index) => <Link key={action.title} href={session.role === "student" && index === 0 ? "/" : "#"} className="group relative overflow-hidden rounded-2xl border border-[#ddd8cc] bg-[#fffdf8] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#8dbb38] hover:shadow-md"><span className={`absolute inset-x-0 top-0 h-1.5 ${action.accent}`} /><div className="flex items-start justify-between"><span className="text-sm font-bold text-[#e06f52]">0{index + 1}</span><span className="text-xl text-[#697386] transition group-hover:translate-x-1 group-hover:text-[#101a2e]" aria-hidden="true">→</span></div><h2 className="mt-8 text-xl font-black text-[#172238]">{action.title}</h2><p className="mt-2 text-sm leading-6 text-[#697386]">{action.description}</p><span className="mt-6 inline-block text-xs font-bold text-[#738f2d]">เปิดเมนู</span></Link>)}</div>
      </div>
    </main>
  );
}