"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      return;
    }

    try {
      await loginUser(email, password);
      setError("");
      router.push("/");
    } catch {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือยังไม่มีบัญชีนี้");
    }
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#101a2e] text-[#172238]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(200,241,105,0.16),transparent_32%),radial-gradient(circle_at_88%_80%,rgba(255,133,103,0.14),transparent_28%)]" />

      <section className="relative hidden w-1/2 flex-col justify-between p-10 text-white lg:flex xl:p-16">
        <Link href="/" className="flex w-fit items-center gap-3" aria-label="กลับหน้าหลัก">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c8f169] text-xl font-black text-[#101a2e]">#</span>
          <span className="text-xl font-bold tracking-tight">base-number</span>
        </Link>

        <div className="max-w-xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[#c8f169]">เรียนรู้ให้เป็นระบบ</p>
          <h1 className="text-5xl font-black leading-tight xl:text-6xl">
            กลับมาเรียนรู้
            <br />
            เลขฐานกันต่อ
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#c4ccda]">
            เข้าสู่ระบบเพื่อบันทึกความคืบหน้า และกลับไปทบทวนบทเรียนเลขฐาน 2, 8, 10 และ 16 ได้ทุกเมื่อ
          </p>
        </div>

        <div className="flex gap-3 text-sm text-[#c4ccda]">
          <span className="rounded-full border border-[#3a4860] px-4 py-2">Binary</span>
          <span className="rounded-full border border-[#3a4860] px-4 py-2">Octal</span>
          <span className="rounded-full border border-[#3a4860] px-4 py-2">Hexadecimal</span>
        </div>
      </section>

      <section className="relative flex w-full items-center justify-center bg-[#f7f3ea] px-5 py-10 sm:px-8 lg:w-1/2 lg:rounded-l-[3rem]">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 flex items-center justify-center gap-3 lg:hidden" aria-label="กลับหน้าหลัก">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#101a2e] text-lg font-black text-[#c8f169]">#</span>
            <span className="text-xl font-bold tracking-tight text-[#101a2e]">base-number</span>
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#e06f52]">ยินดีต้อนรับกลับ</p>
            <h2 className="text-3xl font-black tracking-tight text-[#101a2e] sm:text-4xl">เข้าสู่ระบบ</h2>
            <p className="mt-3 text-[#697386]">กรอกข้อมูลของคุณเพื่อเข้าสู่บทเรียน</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#29364c]">อีเมล</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#ddd8cc] bg-white px-4 py-3.5 text-[#172238] outline-none transition placeholder:text-[#a1a7b0] focus:border-[#8dbb38] focus:ring-4 focus:ring-[#dff3ae]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-bold text-[#29364c]">รหัสผ่าน</label>
                <button type="button" className="text-sm font-semibold text-[#738f2d] transition hover:text-[#536e1c]">ลืมรหัสผ่าน?</button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="กรอกรหัสผ่านของคุณ"
                  className="w-full rounded-xl border border-[#ddd8cc] bg-white px-4 py-3.5 pr-20 text-[#172238] outline-none transition placeholder:text-[#a1a7b0] focus:border-[#8dbb38] focus:ring-4 focus:ring-[#dff3ae]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-[#697386] hover:bg-[#f0ede5] hover:text-[#172238]"
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                >
                  {showPassword ? "ซ่อน" : "แสดง"}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-[#697386]">
              <input type="checkbox" name="remember" className="h-4 w-4 rounded border-[#c8c2b5] accent-[#738f2d]" />
              จดจำการเข้าสู่ระบบ
            </label>

            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

            <button type="submit" className="w-full rounded-xl bg-[#101a2e] px-4 py-3.5 font-bold text-[#c8f169] shadow-lg shadow-[#101a2e]/20 transition hover:bg-[#1d2d49] focus:outline-none focus:ring-4 focus:ring-[#cfe894]">
              เข้าสู่ระบบ
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#697386]">
            ยังไม่มีบัญชี? <Link href="/signup" className="font-bold text-[#738f2d] hover:text-[#536e1c]">สมัครสมาชิก</Link>
          </p>

        </div>
      </section>
    </main>
  );
}