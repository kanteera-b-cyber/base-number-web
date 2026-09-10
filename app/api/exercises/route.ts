import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "../../lib/supabase/server";

function authorize(request: NextRequest) {
  const expected = process.env.SUPABASE_TEST_TOKEN;
  return Boolean(expected && request.headers.get("x-supabase-test-token") === expected);
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("exercises")
      .select("id, lesson_id, title, problem, created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, exercises: data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!authorize(request)) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json() as { lessonId?: number; createdBy?: string; title?: string; problem?: string };
    if (!body.lessonId || !body.createdBy || !body.title?.trim() || !body.problem?.trim()) {
      return NextResponse.json({ ok: false, error: "lessonId, createdBy, title, and problem are required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("exercises")
      .insert({ lesson_id: body.lessonId, created_by: body.createdBy, title: body.title.trim(), problem: body.problem.trim() })
      .select("id, lesson_id, title, problem, created_at")
      .single();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, exercise: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
  }
}
