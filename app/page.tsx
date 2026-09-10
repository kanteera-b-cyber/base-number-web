"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getClientReady, getServerReady, getServerSession, getSession, logout, roleLabels, subscribeToClientReady, subscribeToSession } from "./lib/auth";

const conversionTable = [
  { decimal: 0, binary: "0000", octal: "0", hex: "0" },
  { decimal: 1, binary: "0001", octal: "1", hex: "1" },
  { decimal: 2, binary: "0010", octal: "2", hex: "2" },
  { decimal: 3, binary: "0011", octal: "3", hex: "3" },
  { decimal: 4, binary: "0100", octal: "4", hex: "4" },
  { decimal: 5, binary: "0101", octal: "5", hex: "5" },
  { decimal: 6, binary: "0110", octal: "6", hex: "6" },
  { decimal: 7, binary: "0111", octal: "7", hex: "7" },
  { decimal: 8, binary: "1000", octal: "10", hex: "8" },
  { decimal: 9, binary: "1001", octal: "11", hex: "9" },
  { decimal: 10, binary: "1010", octal: "12", hex: "A" },
  { decimal: 11, binary: "1011", octal: "13", hex: "B" },
  { decimal: 12, binary: "1100", octal: "14", hex: "C" },
  { decimal: 13, binary: "1101", octal: "15", hex: "D" },
  { decimal: 14, binary: "1110", octal: "16", hex: "E" },
  { decimal: 15, binary: "1111", octal: "17", hex: "F" },
];

const chapters = [
  {
    id: 1,
    title: "บทนำ",
    short: "01 บทนำ",
    label: "บทนำ",
    subtitle: "ทำความรู้จักกับระบบเลขฐาน",
    description:
      "ระบบเลขฐานเป็นวิธีการแทนจำนวนด้วยสัญลักษณ์ต่าง ๆ การนับของมนุษย์ใช้เลขฐาน 10 แต่คอมพิวเตอร์ใช้เลขฐาน 2, 8, 10, 16 เนื่องจากระบบดิจิทัลทำงานด้วยสัญญาณเปิด/ปิด",
    principles: [
      "เลขฐานหมายถึงจำนวนสัญลักษณ์ที่ใช้ในแต่ละหลัก",
      "หลักแต่ละตัวมีค่าตามกำลังของฐาน",
      "เมื่อมีค่าเท่ากับฐาน จะต้องทดขึ้นไปยังหลักถัดไป",
    ],
    example: "ฐาน 10: 345 = 3×100 + 4×10 + 5×1",
    thinking: "คิดแบบเดียวกับการนับปกติ แต่ค่าของแต่ละหลักขึ้นอยู่กับฐานที่ใช้",
    addExample: "8 + 7 = 15 → เขียน 5 และยก 1 ไปหลักถัดไป",
    subExample: "20 - 6 = 14 → ใช้การยืมจากหลักถัดไปเมื่อจำเป็น",
  },
  {
    id: 2,
    title: "ฐานสอง",
    short: "02 ฐานสอง",
    label: "Binary",
    subtitle: "เลขฐานสอง",
    description:
      "เลขฐานสองใช้ตัวเลข 0 และ 1 เท่านั้น เพราะคอมพิวเตอร์ใช้สัญญาณดิจิทัลที่มีแค่สองสถานะ คือ เปิดและปิด ดังนั้นค่าของแต่ละหลักจึงเป็นกำลังของ 2",
    principles: [
      "เลขฐานสองมีตัวเลขแค่ 0 และ 1",
      "หลักที่ 1 มีค่า 2⁰, หลักที่ 2 มีค่า 2¹, หลักที่ 3 มีค่า 2²",
      "1 + 1 = 10₂ จึงต้องทดไปหลักถัดไป",
    ],
    example: "1011₂ = 1×8 + 0×4 + 1×2 + 1×1 = 11₁₀",
    thinking: "ถ้าผลรวมมากกว่าหรือเท่ากับ 2 ให้เขียน 0 และยก 1 ไปชั้นบน",
    addExample: "1011₂ + 0011₂ = 1110₂",
    subExample: "1010₂ - 0011₂ = 0111₂",
    quizzes: [
      {
        title: "ตัวอย่างที่ 1",
        problem: "1011₂ + 1101₂",
        subtitle: "Binary Addition",
        steps: [
          "จัดตำแหน่งตัวเลข",
          "  1011",
          "+ 1101",
          "______",
          "",
          "บรรยายวิธีสูตร",
          "หลัก 1: 1 + 1 = 10₂ → เขียน 0, ทด 1",
          "หลัก 2: 1 + 0 + 1(ทด) = 10₂ → เขียน 0, ทด 1",
          "หลัก 3: 0 + 1 + 1(ทด) = 10₂ → เขียน 0, ทด 1",
          "หลัก 4: 1 + 1 + 1(ทด) = 11₂ → เขียน 11",
          "",
          "คำตอบ: 11000₂"
        ]
      },
      {
        title: "ตัวอย่างที่ 2",
        problem: "1100₂ - 0101₂",
        subtitle: "Binary Subtraction",
        steps: [
          "จัดตำแหน่งตัวเลข",
          "  1100",
          "- 0101",
          "______",
          "",
          "บรรยายวิธีสูตร",
          "หลัก 1: 0 - 1 ไม่ได้ → ยืมจากหลักซ้าย → 10₂ - 1 = 1",
          "หลัก 2: 0 - 1(ยืม) - 0 ไม่ได้ → ยืมจากหลักซ้าย → 10₂ - 1 - 0 = 1",
          "หลัก 3: 1 - 1(ยืม) - 1 = -1 ไม่ได้ → ยืมจากหลักซ้าย → 10₂ - 1 - 1 = 0",
          "หลัก 4: 1 - 1(ยืม) = 0",
          "",
          "คำตอบ: 0111₂ (เท่ากับ 7 ในฐาน 10)"
        ]
      }
    ]
  },
  {
    id: 3,
    title: "ฐานแปด",
    short: "03 ฐานแปด",
    label: "Octal",
    subtitle: "เลขฐานแปด",
    description:
      "เลขฐานแปดมีตัวเลข 0 ถึง 7 และมีความสัมพันธ์กับฐานสองอย่างมาก เพราะ 8 = 2³ ดังนั้นแต่ละหลักของฐานแปดเท่ากับกลุ่ม 3 บิต",
    principles: [
      "ตัวเลขใช้ได้แค่ 0 ถึง 7",
      "กำลังของ 8 เป็นค่าแต่ละหลัก เช่น 8⁰, 8¹, 8²",
      "ถ้าผลรวม >= 8 ให้ทด 8 ไปหลักถัดไป",
    ],
    example: "27₈ = 2×8 + 7×1 = 23₁₀",
    thinking: "เลขฐานแปดเหมือนเลขฐานสิบ แต่เมื่อครบ 8 จะยก 1 ไปตัวหน้าทันที",
    addExample: "27₈ + 13₈ = 42₈",
    subExample: "45₈ - 17₈ = 26₈",
    quizzes: [
      {
        title: "ตัวอย่างที่ 1",
        problem: "36₈ + 24₈",
        subtitle: "Octal Addition",
        steps: [
          "จัดตำแหน่งตัวเลข",
          "  36",
          "+ 24",
          "____",
          "",
          "บรรยายวิธีสูตร",
          "หลัก 1: 6 + 4 = 10 → เนื่องจาก 10 > 7 → 10 - 8 = 2, ทด 1",
          "หลัก 2: 3 + 2 + 1(ทด) = 6 → 6 < 8 เขียนตรงๆ",
          "",
          "คำตอบ: 62₈ (เท่ากับ 50 ในฐาน 10)"
        ]
      },
      {
        title: "ตัวอย่างที่ 2",
        problem: "73₈ - 25₈",
        subtitle: "Octal Subtraction",
        steps: [
          "จัดตำแหน่งตัวเลข",
          "  73",
          "- 25",
          "____",
          "",
          "บรรยายวิธีสูตร",
          "หลัก 1: 3 - 5 ไม่ได้ → ยืมจากหลักซ้าย (ยืมมา 8) → 3 + 8 - 5 = 6",
          "หลัก 2: 7 - 1(ยืม) - 2 = 4",
          "",
          "คำตอบ: 46₈ (เท่ากับ 38 ในฐาน 10)"
        ]
      }
    ]
  },
  {
    id: 4,
    title: "ฐานสิบ",
    short: "04 ฐานสิบ",
    label: "Decimal",
    subtitle: "เลขฐานสิบ",
    description:
      "เลขฐานสิบเป็นระบบที่มนุษย์ใช้ในชีวิตประจำวัน เพราะมีตัวเลข 0 ถึง 9 และแต่ละหลักมีค่าเป็นกำลังของ 10 เช่น 1, 10, 100, 1000",
    principles: [
      "เลขฐานสิบมี 10 ตัวเลข 0 ถึง 9",
      "หลักแต่ละตัวมีค่าน้ำหนัก 10^n",
      "เมื่อผลบวก >= 10 ต้องทด 10 ไปหลักถัดไป",
    ],
    example: "345₁₀ = 3×100 + 4×10 + 5×1",
    thinking: "การบวกเลขฐานสิบเหมือนคณิตศาสตร์ปกติ เราเขียนเลข 0-9 และยก 1 เมื่อเกิน 9",
    addExample: "47 + 28 = 75",
    subExample: "63 - 29 = 34",
    quizzes: [
      {
        title: "ตัวอย่างที่ 1",
        problem: "56 + 37",
        subtitle: "Decimal Addition",
        steps: [
          "จัดตำแหน่งตัวเลข",
          "  56",
          "+ 37",
          "____",
          "",
          "บรรยายวิธีสูตร",
          "หลัก 1: 6 + 7 = 13 → เนื่องจาก 13 > 9 → 13 - 10 = 3, ทด 1",
          "หลัก 2: 5 + 3 + 1(ทด) = 9 → 9 ≤ 9 เขียนตรงๆ",
          "",
          "คำตอบ: 93"
        ]
      },
      {
        title: "ตัวอย่างที่ 2",
        problem: "82 - 45",
        subtitle: "Decimal Subtraction",
        steps: [
          "จัดตำแหน่งตัวเลข",
          "  82",
          "- 45",
          "____",
          "",
          "บรรยายวิธีสูตร",
          "หลัก 1: 2 - 5 ไม่ได้ → ยืมจากหลักซ้าย (ยืมมา 10) → 2 + 10 - 5 = 7",
          "หลัก 2: 8 - 1(ยืม) - 4 = 3",
          "",
          "คำตอบ: 37"
        ]
      }
    ]
  },
  {
    id: 5,
    title: "ฐานสิบหก",
    short: "05 ฐานสิบหก",
    label: "Hexadecimal",
    subtitle: "เลขฐานสิบหก",
    description:
      "เลขฐานสิบหกใช้ตัวเลข 0-9 และ A-F เพื่อแทนค่า 10 ถึง 15 จึงเหมาะกับงานที่เขียนเลขในคอมพิวเตอร์ได้สั้นและชัดเจนมากกว่าเลขฐานสอง",
    principles: [
      "ตัวเลขใช้ได้ 0-9, A-F",
      "A=10, B=11, C=12, D=13, E=14, F=15",
      "ผลรวมที่ >= 16 ให้ทด 16 ไปหลักถัดไป",
    ],
    example: "2F₁₆ = 2×16 + 15×1 = 47₁₀",
    thinking: "เลขฐานสิบหกเหมือนฐานสิบ แต่แทนค่าที่มากกว่า 9 ด้วยอักขระ A-F เพื่อให้สั้นลง",
    addExample: "2F₁₆ + 1A₁₆ = 49₁₆",
    subExample: "5A₁₆ - 2D₁₆ = 2D₁₆",
    quizzes: [
      {
        title: "ตัวอย่างที่ 1",
        problem: "3B₁₆ + 2E₁₆",
        subtitle: "Hexadecimal Addition",
        steps: [
          "จัดตำแหน่งตัวเลข",
          "  3B",
          "+ 2E",
          "____",
          "",
          "บรรยายวิธีสูตร",
          "หลัก 1: B + E = 11 + 14 = 25 → เนื่องจาก 25 > 15 → 25 - 16 = 9, ทด 1",
          "หลัก 2: 3 + 2 + 1(ทด) = 6",
          "",
          "คำตอบ: 69₁₆ (เท่ากับ 105 ในฐาน 10)"
        ]
      },
      {
        title: "ตัวอย่างที่ 2",
        problem: "A7₁₆ - 3F₁₆",
        subtitle: "Hexadecimal Subtraction",
        steps: [
          "จัดตำแหน่งตัวเลข",
          "  A7",
          "- 3F",
          "____",
          "",
          "บรรยายวิธีสูตร",
          "หลัก 1: 7 - F = 7 - 15 ไม่ได้ → ยืมจากหลักซ้าย (ยืมมา 16) → 7 + 16 - 15 = 8",
          "หลัก 2: A - 1(ยืม) - 3 = 10 - 1 - 3 = 6",
          "",
          "คำตอบ: 68₁₆ (เท่ากับ 104 ในฐาน 10)"
        ]
      }
    ]
  },
];

export default function Home() {
  const router = useRouter();
  const session = useSyncExternalStore(subscribeToSession, getSession, getServerSession);
  const isReady = useSyncExternalStore(subscribeToClientReady, getClientReady, getServerReady);
  const [selectedId, setSelectedId] = useState(1);
  const [teacherPanel, setTeacherPanel] = useState<"content" | "exercise" | "results">("content");
  const [adminPanel, setAdminPanel] = useState<"users" | "activity" | "settings">("users");
  const [studentPanel, setStudentPanel] = useState<"exercise" | "steps" | "table">("exercise");
  const [exerciseSaved, setExerciseSaved] = useState(false);
  const selectedChapter = chapters.find((chapter) => chapter.id === selectedId) ?? chapters[0];
  const isTeacher = session?.role === "teacher";
  const isAdmin = session?.role === "admin";

  useEffect(() => {
    if (isReady && !session) router.replace("/login");
  }, [isReady, router, session]);

  if (!isReady || !session) return <main className="min-h-screen bg-[#101a2e]" />;

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function handleExerciseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setExerciseSaved(true);
  }

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-[#172238] font-sans">
      <nav className="flex items-center justify-between bg-[#fffdf8] px-6 py-5 shadow-sm border-b border-[#ddd8cc]">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#101a2e] text-xl font-black text-[#c8f169]">
            #
          </div>
          <div className="text-xl font-bold text-[#101a2e]">base-number</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden text-xs font-semibold text-[#697386] uppercase tracking-wide sm:block">{session.name} · {roleLabels[session.role]}</div>
          <button type="button" onClick={handleLogout} className="rounded-lg bg-[#101a2e] px-3 py-2 text-xs font-bold text-[#c8f169] hover:bg-[#1d2d49]">ออกจากระบบ</button>
        </div>
      </nav>

      <header className="bg-[#101a2e] px-6 py-16 text-white border-b border-[#101a2e]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#101a2e] bg-[#c8f169] px-3 py-1 rounded-full">
              {isTeacher ? "พื้นที่สำหรับครู" : isAdmin ? "ศูนย์ควบคุมระบบ" : "ระบบเลขฐาน"}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 text-[#c8f169]">
            {isTeacher ? "จัดการบทเรียนเลขฐาน" : isAdmin ? "ดูแลระบบ base-number" : "base-number"}
          </h1>
          
          <p className="text-lg md:text-xl text-[#c4ccda] max-w-3xl leading-relaxed mb-10 font-regular">
            {isTeacher
              ? "จัดการเนื้อหาเลขฐาน 2, 8, 10, 16 พร้อมดูแลแบบฝึกหัดและความก้าวหน้าของผู้เรียน"
              : isAdmin
                ? "ควบคุมผู้ใช้งาน ตรวจสอบกิจกรรม และตั้งค่าระบบการเรียนรู้เลขฐาน"
              : "ระบบเลขฐาน 2, 8, 10, 16 ที่อธิบายแบบละเอียด • วิธีคิด • การบวกลบ • การแปลงเลข"}
          </p>
          
          <div className="flex flex-wrap gap-3">
            {isTeacher ? (
              <>
                <button type="button" onClick={() => setTeacherPanel("content")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${teacherPanel === "content" ? "bg-[#e06f52] text-white" : "bg-[#263653] text-[#f7f3ea] hover:bg-[#314565]"}`}>จัดการบทเรียน</button>
                <button type="button" onClick={() => { setTeacherPanel("exercise"); setExerciseSaved(false); }} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${teacherPanel === "exercise" ? "bg-[#e06f52] text-white" : "bg-[#263653] text-[#f7f3ea] hover:bg-[#314565]"}`}>เพิ่มแบบฝึกหัด</button>
                <button type="button" onClick={() => setTeacherPanel("results")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${teacherPanel === "results" ? "bg-[#e06f52] text-white" : "bg-[#263653] text-[#f7f3ea] hover:bg-[#314565]"}`}>ดูผลการเรียน</button>
              </>
            ) : isAdmin ? (
              <>
                <button type="button" onClick={() => setAdminPanel("users")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${adminPanel === "users" ? "bg-[#e06f52] text-white" : "bg-[#263653] text-[#f7f3ea] hover:bg-[#314565]"}`}>จัดการผู้ใช้งาน</button>
                <button type="button" onClick={() => setAdminPanel("activity")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${adminPanel === "activity" ? "bg-[#e06f52] text-white" : "bg-[#263653] text-[#f7f3ea] hover:bg-[#314565]"}`}>ตรวจสอบกิจกรรม</button>
                <button type="button" onClick={() => setAdminPanel("settings")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${adminPanel === "settings" ? "bg-[#e06f52] text-white" : "bg-[#263653] text-[#f7f3ea] hover:bg-[#314565]"}`}>ตั้งค่าระบบ</button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setStudentPanel("exercise")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${studentPanel === "exercise" ? "bg-[#e06f52] text-white" : "bg-[#263653] text-[#f7f3ea] hover:bg-[#314565]"}`}>★ ตัวอย่างฝึกหัด</button>
                <button type="button" onClick={() => setStudentPanel("steps")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${studentPanel === "steps" ? "bg-[#e06f52] text-white" : "bg-[#263653] text-[#f7f3ea] hover:bg-[#314565]"}`}>★ ขั้นตอนละเอียด</button>
                <button type="button" onClick={() => setStudentPanel("table")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${studentPanel === "table" ? "bg-[#e06f52] text-white" : "bg-[#263653] text-[#f7f3ea] hover:bg-[#314565]"}`}>★ ตารางเปรียบเทียบ</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {!isTeacher && !isAdmin && studentPanel === "exercise" && (
          <section className="mb-6 rounded-2xl border border-[#f8c4b6] bg-[#fff0eb] p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c95d43]">ฝึกทำโจทย์</p>
            <h2 className="mt-1 text-2xl font-black text-[#172238]">ตัวอย่างแบบฝึกหัด: {selectedChapter.title}</h2>
            {selectedChapter.quizzes?.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {selectedChapter.quizzes.map((quiz) => (
                  <div key={quiz.title} className="rounded-xl bg-[#fffdf8] p-4">
                    <div className="text-sm font-bold text-[#e06f52]">{quiz.title}</div>
                    <div className="mt-2 text-2xl font-black text-[#101a2e]">{quiz.problem}</div>
                    <div className="mt-1 text-sm text-[#697386]">{quiz.subtitle}</div>
                  </div>
                ))}
              </div>
            ) : <p className="mt-4 text-[#46536a]">บทนี้กำลังเตรียมแบบฝึกหัด ลองเลือกบทฐานสอง ฐานแปด ฐานสิบ หรือฐานสิบหก</p>}
          </section>
        )}

        {!isTeacher && !isAdmin && studentPanel === "steps" && (
          <section className="mb-6 rounded-2xl border border-[#d6e9a8] bg-[#eef7d7] p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#738f2d]">วิธีคิดทีละขั้น</p>
            <h2 className="mt-1 text-2xl font-black text-[#172238]">{selectedChapter.subtitle}</h2>
            <p className="mt-4 leading-7 text-[#46536a]">{selectedChapter.thinking}</p>
            <div className="mt-4 rounded-xl bg-[#fffdf8] p-4 font-mono text-sm font-bold text-[#29364c]">{selectedChapter.example}</div>
          </section>
        )}

        {!isTeacher && !isAdmin && studentPanel === "table" && (
          <section className="mb-6 rounded-2xl border border-[#ddd8cc] bg-[#fffdf8] p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e06f52]">ดูภาพรวมตัวเลข</p>
            <h2 className="mt-1 text-2xl font-black text-[#172238]">ตารางเปรียบเทียบเลขฐาน 0-15</h2>
            <div className="mt-5 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b-2 border-[#c8c2b5]"><th className="px-3 py-2 text-left">ฐาน10</th><th className="px-3 py-2">ฐาน2</th><th className="px-3 py-2">ฐาน8</th><th className="px-3 py-2">ฐาน16</th></tr></thead><tbody>{conversionTable.map((row) => <tr key={row.decimal} className="border-b border-[#e4dfd5]"><td className="px-3 py-2">{row.decimal}</td><td className="px-3 py-2 text-center font-mono">{row.binary}</td><td className="px-3 py-2 text-center font-mono">{row.octal}</td><td className="px-3 py-2 text-center font-mono font-bold">{row.hex}</td></tr>)}</tbody></table></div>
          </section>
        )}

        {isTeacher && teacherPanel === "exercise" && (
          <section className="mb-6 rounded-2xl border border-[#f8c4b6] bg-[#fff0eb] p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c95d43]">เครื่องมือครู</p>
                <h2 className="mt-1 text-2xl font-black text-[#172238]">เพิ่มแบบฝึกหัดใหม่</h2>
                <p className="mt-2 text-sm text-[#697386]">สร้างโจทย์สำหรับบทที่ {selectedChapter.id}: {selectedChapter.title}</p>
              </div>
              <span className="rounded-full bg-[#e06f52] px-3 py-1 text-xs font-bold text-white">แบบฝึกหัด</span>
            </div>
            <form onSubmit={handleExerciseSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <input name="title" required placeholder="ชื่อแบบฝึกหัด" className="rounded-xl border border-[#f8c4b6] bg-[#fffdf8] px-4 py-3 text-sm outline-none focus:border-[#e06f52]" />
              <input name="problem" required placeholder="โจทย์ เช่น 1011₂ + 1101₂" className="rounded-xl border border-[#f8c4b6] bg-[#fffdf8] px-4 py-3 text-sm outline-none focus:border-[#e06f52]" />
              <button type="submit" className="rounded-xl bg-[#101a2e] px-5 py-3 text-sm font-bold text-[#c8f169] hover:bg-[#1d2d49]">บันทึกโจทย์</button>
            </form>
            {exerciseSaved && <p role="status" className="mt-4 text-sm font-bold text-[#738f2d]">บันทึกแบบฝึกหัดเรียบร้อยแล้ว</p>}
          </section>
        )}

        {isTeacher && teacherPanel === "results" && (
          <section className="mb-6 rounded-2xl border border-[#d6e9a8] bg-[#eef7d7] p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#738f2d]">ภาพรวมชั้นเรียน</p>
            <h2 className="mt-1 text-2xl font-black text-[#172238]">ผลการเรียนของผู้เรียน</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[#fffdf8] p-4"><div className="text-sm text-[#697386]">ผู้เรียนทั้งหมด</div><div className="mt-1 text-3xl font-black text-[#172238]">24</div></div>
              <div className="rounded-xl bg-[#fffdf8] p-4"><div className="text-sm text-[#697386]">เรียนจบบทล่าสุด</div><div className="mt-1 text-3xl font-black text-[#738f2d]">18</div></div>
              <div className="rounded-xl bg-[#fffdf8] p-4"><div className="text-sm text-[#697386]">คะแนนเฉลี่ย</div><div className="mt-1 text-3xl font-black text-[#e06f52]">82%</div></div>
            </div>
          </section>
        )}

        {isAdmin && (
          <section className="mb-6 rounded-2xl border border-[#ddd8cc] bg-[#fffdf8] p-6 shadow-sm">
            {adminPanel === "users" && (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e06f52]">ผู้ดูแลระบบ</p>
                <h2 className="mt-1 text-2xl font-black text-[#172238]">จัดการผู้ใช้งาน</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-[#eef7d7] p-4"><div className="text-sm text-[#697386]">ผู้ใช้งานทั้งหมด</div><div className="mt-1 text-3xl font-black text-[#172238]">128</div></div>
                  <div className="rounded-xl bg-[#fff0eb] p-4"><div className="text-sm text-[#697386]">ครู</div><div className="mt-1 text-3xl font-black text-[#e06f52]">12</div></div>
                  <div className="rounded-xl bg-[#f0ede5] p-4"><div className="text-sm text-[#697386]">นักเรียน</div><div className="mt-1 text-3xl font-black text-[#738f2d]">114</div></div>
                </div>
              </>
            )}
            {adminPanel === "activity" && (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e06f52]">ความปลอดภัยและการติดตาม</p>
                <h2 className="mt-1 text-2xl font-black text-[#172238]">ตรวจสอบกิจกรรมล่าสุด</h2>
                <div className="mt-5 space-y-3 text-sm text-[#46536a]"><div className="rounded-xl bg-[#f0ede5] px-4 py-3">ครู 12 คนกำลังใช้งานระบบ</div><div className="rounded-xl bg-[#eef7d7] px-4 py-3">มีการอัปเดตบทเรียนล่าสุดเมื่อวันนี้</div><div className="rounded-xl bg-[#fff0eb] px-4 py-3">ไม่พบกิจกรรมผิดปกติ</div></div>
              </>
            )}
            {adminPanel === "settings" && (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e06f52]">การตั้งค่าระบบ</p>
                <h2 className="mt-1 text-2xl font-black text-[#172238]">ตั้งค่า base-number</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-[#ddd8cc] p-4"><div className="font-bold text-[#172238]">สถานะระบบ</div><div className="mt-1 text-sm text-[#738f2d]">ทำงานปกติ</div></div><div className="rounded-xl border border-[#ddd8cc] p-4"><div className="font-bold text-[#172238]">การสำรองข้อมูล</div><div className="mt-1 text-sm text-[#697386]">สำรองล่าสุดวันนี้</div></div></div>
              </>
            )}
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-[#ddd8cc] bg-[#fffdf8] p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-[#172238]">{isTeacher ? "จัดการบทเรียน" : isAdmin ? "ภาพรวมบทเรียน" : "เนื้อหาบทเรียน"}</h2>

            <div className="space-y-2">
              {chapters.map((chapter) => {
                const isActive = chapter.id === selectedId;

                return (
                  <button
                    type="button"
                    key={chapter.id}
                    onClick={() => setSelectedId(chapter.id)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition-all ${
                      isActive
                        ? "border-[#101a2e] bg-[#101a2e] text-[#c8f169] shadow-md"
                        : "border-[#ddd8cc] bg-[#fffdf8] text-[#697386] hover:bg-white hover:border-[#8dbb38]"
                    }`}
                  >
                    <div className="text-xs font-semibold uppercase text-[#8a929f]">
                      {chapter.short}
                    </div>
                    <div className="mt-1 text-base font-bold">{chapter.title}</div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-2xl border border-[#ddd8cc] bg-[#fffdf8] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase text-[#8a929f]">
                  บทที่ {selectedChapter.id}
                </div>
                <h2 className="mt-2 text-3xl font-black text-[#172238]">{isTeacher ? `แก้ไขเนื้อหา: ${selectedChapter.subtitle}` : isAdmin ? `ตรวจสอบบทเรียน: ${selectedChapter.subtitle}` : selectedChapter.subtitle}</h2>
              </div>
              <div className="rounded-full bg-[#c8f169] text-[#101a2e] px-3 py-1 text-sm font-bold whitespace-nowrap">
                {isTeacher ? "โหมดครู" : isAdmin ? "โหมดแอดมิน" : selectedChapter.label}
              </div>
            </div>

            {isTeacher && (
              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#d6e9a8] bg-[#eef7d7] px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#738f2d]">สถานะ</div>
                  <div className="mt-1 font-black text-[#172238]">เผยแพร่แล้ว</div>
                </div>
                <div className="rounded-xl border border-[#f8c4b6] bg-[#fff0eb] px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#c95d43]">แบบฝึกหัด</div>
                  <div className="mt-1 font-black text-[#172238]">2 ตัวอย่าง</div>
                </div>
                <div className="rounded-xl border border-[#ddd8cc] bg-[#f0ede5] px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#697386]">ผู้เรียน</div>
                  <div className="mt-1 font-black text-[#172238]">ติดตามผลได้</div>
                </div>
              </div>
            )}

            <p className="text-lg leading-relaxed text-[#46536a]">{selectedChapter.description}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[#f0ede5] border border-[#ddd8cc] p-4">
                <div className="text-xs font-semibold uppercase text-[#697386]">แนวคิดหลัก</div>
                <ul className="mt-3 space-y-2 text-[#46536a]">
                  {selectedChapter.principles.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#e06f52] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedChapter.example === "tableData" ? (
                <div className="rounded-2xl bg-[#f0ede5] border border-[#ddd8cc] p-4 overflow-x-auto">
                  <div className="text-xs font-semibold uppercase text-[#697386] mb-3">ตารางเปรียบเทียบ (0-15)</div>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#c8c2b5]">
                        <th className="px-2 py-2 text-left font-bold text-[#172238]">ฐาน10</th>
                        <th className="px-2 py-2 text-center font-bold text-[#172238]">ฐาน2</th>
                        <th className="px-2 py-2 text-center font-bold text-[#172238]">ฐาน8</th>
                        <th className="px-2 py-2 text-center font-bold text-[#172238]">ฐาน16</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionTable.map((row, idx) => (
                        <tr key={idx} className={`border-b border-[#e4dfd5] ${idx % 2 === 0 ? 'bg-[#fffdf8]' : 'bg-[#f7f3ea]'}`}>
                          <td className="px-2 py-2 text-[#172238]">{row.decimal}</td>
                          <td className="px-2 py-2 text-center font-mono text-[#46536a]">{row.binary}</td>
                          <td className="px-2 py-2 text-center font-mono text-[#46536a]">{row.octal}</td>
                          <td className="px-2 py-2 text-center font-mono text-[#172238] font-bold">{row.hex}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#f0ede5] border border-[#ddd8cc] p-4">
                  <div className="text-xs font-semibold uppercase text-[#697386]">วิธีคิด</div>
                  <p className="mt-3 text-[#46536a]">{selectedChapter.thinking}</p>
                  <div className="mt-4 rounded-xl bg-[#fffdf8] border border-[#ddd8cc] p-3 text-sm font-medium text-[#29364c]">
                    {selectedChapter.example}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#d6e9a8] bg-[#eef7d7] p-4">
                <div className="text-xs font-semibold uppercase text-[#738f2d]">การบวก</div>
                <div className="mt-2 text-lg font-bold text-[#172238]">{selectedChapter.addExample}</div>
              </div>

              <div className="rounded-2xl border border-[#f8c4b6] bg-[#fff0eb] p-4">
                <div className="text-xs font-semibold uppercase text-[#c95d43]">การลบ</div>
                <div className="mt-2 text-lg font-bold text-[#172238]">{selectedChapter.subExample}</div>
              </div>
            </div>

            {selectedChapter.quizzes && selectedChapter.quizzes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-black text-[#172238] mb-6">📝 ตัวอย่างการแบบฝึกหัด</h3>
                <div className="space-y-6">
                  {selectedChapter.quizzes.map((quiz, idx) => (
                    <div key={idx}>
                      <div className="rounded-3xl p-8 mb-4 text-white bg-[#101a2e]">
                        <div className="text-sm font-semibold uppercase tracking-wide text-[#c8ccda] mb-3">
                          {quiz.title}
                        </div>
                        <div className="text-5xl font-black font-mono mb-3">
                          {quiz.problem}
                        </div>
                        <div className="text-[#c4ccda]">{quiz.subtitle}</div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl bg-[#eef7d7] border border-[#d6e9a8] p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#738f2d] text-white font-bold text-sm">1</div>
                            <div className="text-sm font-bold text-[#172238]">จัดตำแหน่งตัวเลข</div>
                          </div>
                          <div className="bg-[#fffdf8] rounded-xl p-4 font-mono text-sm leading-loose text-[#29364c] whitespace-pre-wrap border border-[#d6e9a8]">
                            {quiz.steps.slice(0, 5).join("\n")}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-[#fff0eb] border border-[#f8c4b6] p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#e06f52] text-white font-bold text-sm">2</div>
                            <div className="text-sm font-bold text-[#172238]">บรรยายวิธีสูตร</div>
                          </div>
                          <div className="space-y-3 text-sm text-[#46536a] leading-relaxed">
                            {quiz.steps.slice(6).map((step, i) => (
                              <div key={i}>
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-[#ddd8cc] bg-[#f0ede5] p-4 text-[#46536a]">
              <div className="text-xs font-semibold uppercase text-[#697386]">สรุป</div>
              <p className="mt-2 text-base leading-7">
                {selectedChapter.title} เป็นระบบที่ใช้แนวคิดเดียวกันกับเลขฐานอื่น ๆ คือให้ความสำคัญกับค่าของแต่ละหลักและการทดเมื่อเกินฐาน
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
