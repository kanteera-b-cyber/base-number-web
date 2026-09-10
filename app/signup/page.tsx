"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { registerUser, roleLabels, UserRole } from "../lib/auth";
import { useRouter } from "next/navigation";

const roleOptions: { role: UserRole; description: string }[] = [
  { role: "student", description: "เรียนบทเรียนและทำแบบฝึกหัด" },
  { role: "teacher", description: "จัดการบทเรียนและติดตามนักเรียน" },
  { role: "admin", description: "จัดการระบบและผู้ใช้งานทั้งหมด" },
];

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    if (!name || !email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง เช่น name@example.com");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await registerUser(name, email, password, role);
      router.push("/");
    } catch (registrationError) {
      const message = registrationError instanceof Error ? registrationError.message : "";
      const normalizedMessage = message.toLowerCase();

      if (normalizedMessage.includes("rate limit") || normalizedMessage.includes("too many") || normalizedMessage.includes("429")) {
        setError("สมัครบ่อยเกินไป ระบบ Supabase จำกัดชั่วคราว กรุณารอ 1-2 นาทีแล้วลองใหม่ด้วยอีเมลใหม่");
      } else if (normalizedMessage.includes("already registered") || normalizedMessage.includes("already exists")) {
        setError("อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ");
      } else if (normalizedMessage.includes("invalid email")) {
        setError("Supabase ไม่ยอมรับอีเมลนี้ กรุณาตรวจสอบรูปแบบอีเมลและการตั้งค่า Email provider");
      } else {
        setError("สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า Supabase แล้วลองใหม่");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101a2e] px-5 py-10">
      <section className="w-full max-w-2xl rounded-[2rem] bg-[#f7f3ea] p-6 shadow-2xl shadow-black/20 sm:p-10">
        <Link href="/login" className="text-sm font-bold text-[#697386] hover:text-[#172238]">← กลับไปเข้าสู่ระบบ</Link>
        <div className="mt-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#e06f52]">เริ่มต้นใช้งาน</p>
          <h1 className="text-3xl font-black text-[#101a2e] sm:text-4xl">สร้างบัญชี base-number</h1>
          <p className="mt-3 text-[#697386]">เลือกบทบาทของคุณเพื่อรับประสบการณ์ที่เหมาะสม</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-2 block text-sm font-bold text-[#29364c]">ชื่อที่แสดง</span>
              <input name="name" required autoComplete="name" placeholder="เช่น สมชาย ใจดี" className="w-full rounded-xl border border-[#ddd8cc] bg-white px-4 py-3.5 outline-none focus:border-[#8dbb38] focus:ring-4 focus:ring-[#dff3ae]" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-[#29364c]">อีเมล</span>
              <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="w-full rounded-xl border border-[#ddd8cc] bg-white px-4 py-3.5 outline-none focus:border-[#8dbb38] focus:ring-4 focus:ring-[#dff3ae]" />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-[#29364c]">รหัสผ่าน</span>
              <input name="password" type="password" required minLength={6} autoComplete="new-password" placeholder="อย่างน้อย 6 ตัวอักษร" className="w-full rounded-xl border border-[#ddd8cc] bg-white px-4 py-3.5 outline-none focus:border-[#8dbb38] focus:ring-4 focus:ring-[#dff3ae]" />
            </label>
          </div>

          <fieldset>
            <legend className="mb-3 text-sm font-bold text-[#29364c]">คุณเป็นใคร?</legend>
            <div className="grid gap-3 md:grid-cols-3">
              {roleOptions.map((option) => (
                <button key={option.role} type="button" onClick={() => setRole(option.role)} className={`rounded-2xl border p-4 text-left transition ${role === option.role ? "border-[#101a2e] bg-[#101a2e] text-[#c8f169] shadow-lg" : "border-[#ddd8cc] bg-white text-[#29364c] hover:border-[#8dbb38]"}`}>
                  <span className="block font-black">{roleLabels[option.role]}</span>
                  <span className={`mt-1 block text-xs leading-5 ${role === option.role ? "text-[#c4ccda]" : "text-[#697386]"}`}>{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-[#e06f52] px-4 py-3.5 font-bold text-white transition hover:bg-[#c95d43] focus:outline-none focus:ring-4 focus:ring-[#f8c4b6] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "กำลังสมัครสมาชิก..." : `สมัครสมาชิกในบทบาท${roleLabels[role]}`}</button>
        </form>
      </section>
    </main>
  );
}