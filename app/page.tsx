"use client";

import { useState } from "react";

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
  const [selectedId, setSelectedId] = useState(1);
  const selectedChapter = chapters.find((chapter) => chapter.id === selectedId) ?? chapters[0];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <nav className="flex items-center justify-between bg-white px-6 py-5 shadow-sm border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-xl font-black text-white">
            #
          </div>
          <div className="text-xl font-bold text-slate-900">base-number</div>
        </div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ระบบเลขฐาน 2 • 8 • 10 • 16</div>
      </nav>

      <header className="bg-white px-6 py-16 text-slate-900 border-b border-slate-200">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              ระบบเลขฐาน
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 text-slate-900">
            base-number
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-relaxed mb-10 font-regular">
            ระบบเลขฐาน 2, 8, 10, 16 ที่อธิบายแบบละเอียด • วิธีคิด • การบวกลบ • การแปลงเลข
          </p>
          
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
              ★ ตัวอย่างฝึกหัด
            </div>
            <div className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-300 transition-colors">
              ★ ขั้นตอนละเอียด
            </div>
            <div className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-300 transition-colors">
              ★ ตารางเปรียบเทียบ
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">เนื้อหาบทเรียน</h2>

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
                        ? "border-slate-900 bg-slate-900 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs font-semibold uppercase text-slate-500">
                      {chapter.short}
                    </div>
                    <div className="mt-1 text-base font-bold">{chapter.title}</div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">
                  บทที่ {selectedChapter.id}
                </div>
                <h2 className="mt-2 text-3xl font-black text-slate-900">{selectedChapter.subtitle}</h2>
              </div>
              <div className="rounded-full bg-slate-200 text-slate-900 px-3 py-1 text-sm font-bold whitespace-nowrap">
                {selectedChapter.label}
              </div>
            </div>

            <p className="text-lg leading-relaxed text-slate-700">{selectedChapter.description}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-100 border border-slate-200 p-4">
                <div className="text-xs font-semibold uppercase text-slate-600">แนวคิดหลัก</div>
                <ul className="mt-3 space-y-2 text-slate-700">
                  {selectedChapter.principles.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-slate-900 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedChapter.example === "tableData" ? (
                <div className="rounded-2xl bg-slate-100 border border-slate-200 p-4 overflow-x-auto">
                  <div className="text-xs font-semibold uppercase text-slate-600 mb-3">ตารางเปรียบเทียบ (0-15)</div>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-300">
                        <th className="px-2 py-2 text-left font-bold text-slate-900">ฐาน10</th>
                        <th className="px-2 py-2 text-center font-bold text-slate-900">ฐาน2</th>
                        <th className="px-2 py-2 text-center font-bold text-slate-900">ฐาน8</th>
                        <th className="px-2 py-2 text-center font-bold text-slate-900">ฐาน16</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionTable.map((row, idx) => (
                        <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                          <td className="px-2 py-2 text-slate-900">{row.decimal}</td>
                          <td className="px-2 py-2 text-center font-mono text-slate-700">{row.binary}</td>
                          <td className="px-2 py-2 text-center font-mono text-slate-700">{row.octal}</td>
                          <td className="px-2 py-2 text-center font-mono text-slate-900 font-bold">{row.hex}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-100 border border-slate-200 p-4">
                  <div className="text-xs font-semibold uppercase text-slate-600">วิธีคิด</div>
                  <p className="mt-3 text-slate-700">{selectedChapter.thinking}</p>
                  <div className="mt-4 rounded-xl bg-white border border-slate-200 p-3 text-sm font-medium text-slate-800">
                    {selectedChapter.example}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
                <div className="text-xs font-semibold uppercase text-slate-600">การบวก</div>
                <div className="mt-2 text-lg font-bold text-slate-900">{selectedChapter.addExample}</div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4">
                <div className="text-xs font-semibold uppercase text-slate-600">การลบ</div>
                <div className="mt-2 text-lg font-bold text-slate-900">{selectedChapter.subExample}</div>
              </div>
            </div>

            {selectedChapter.quizzes && selectedChapter.quizzes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-black text-slate-900 mb-6">📝 ตัวอย่างการแบบฝึกหัด</h3>
                <div className="space-y-6">
                  {selectedChapter.quizzes.map((quiz, idx) => (
                    <div key={idx}>
                      <div className="rounded-3xl p-8 mb-4 text-center text-white bg-slate-900">
                        <div className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-3">
                          {quiz.title}
                        </div>
                        <div className="text-5xl font-black font-mono mb-3">
                          {quiz.problem}
                        </div>
                        <div className="text-slate-300">{quiz.subtitle}</div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-sm">1</div>
                            <div className="text-sm font-bold text-slate-900">จัดตำแหน่งตัวเลข</div>
                          </div>
                          <div className="bg-white rounded-xl p-4 font-mono text-sm leading-loose text-slate-800 whitespace-pre-wrap border border-slate-200">
                            {quiz.steps.slice(0, 5).join("\n")}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-green-50 border border-green-200 p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-sm">2</div>
                            <div className="text-sm font-bold text-slate-900">บรรยายวิธีสูตร</div>
                          </div>
                          <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
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

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-100 p-4 text-slate-700">
              <div className="text-xs font-semibold uppercase text-slate-600">สรุป</div>
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
