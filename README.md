# base-number

ระบบเรียนรู้เลขฐาน 2, 8, 10 และ 16 พร้อมโหมดนักเรียน ครู และแอดมิน

## Local development

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Supabase setup

1. สร้างโปรเจกต์ที่ [Supabase](https://supabase.com/dashboard)
2. เปิด **SQL Editor** แล้วรัน [`supabase/schema.sql`](supabase/schema.sql)
3. คัดลอก [`.env.example`](.env.example) เป็น `.env.local`
4. ใส่ค่า `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` และ `SUPABASE_TEST_TOKEN` จาก **Project Settings > API** และสร้าง token ทดสอบแบบสุ่มเอง
5. เปิด [http://localhost:3000/api/health](http://localhost:3000/api/health) เพื่อตรวจการอ่านฐานข้อมูล ต้องได้ `{ "ok": true }`
6. ทดสอบบันทึก/อ่านแบบฝึกหัดผ่าน API โดยส่ง header `x-supabase-test-token` ให้ตรงกับ `SUPABASE_TEST_TOKEN` ไปที่ `/api/exercises`

ใช้ publishable key กับ SSR cookie client เท่านั้น ห้ามนำ secret key ใด ๆ ไปใส่ใน client component หรือ commit ขึ้น Git

## GitHub

```bash
git init
git add .
git commit -m "Set up Supabase integration"
git branch -M main
git remote add origin https://github.com/<account>/<repository>.git
git push -u origin main
```

## Vercel

Import repository ใน Vercel แล้วเพิ่ม environment variables ทั้ง 3 ค่าใน **Project Settings > Environment Variables** จากนั้น Deploy และทดสอบ `/api/health`, Login และ role ต่าง ๆ หลัง deploy
