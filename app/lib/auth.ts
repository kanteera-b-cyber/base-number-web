import { createBrowserSupabaseClient } from "./supabase/client";

export type UserRole = "student" | "teacher" | "admin";

type Session = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export const roleLabels: Record<UserRole, string> = {
  student: "นักเรียน",
  teacher: "ครู",
  admin: "แอดมิน",
};

let supabase: ReturnType<typeof createBrowserSupabaseClient> | null = null;
let sessionSnapshot: Session | null = null;
let authReady = false;
let initialized = false;
const listeners = new Set<() => void>();

function getClient() {
  supabase ??= createBrowserSupabaseClient();
  return supabase;
}

async function loadProfile(user: { id: string; email?: string; user_metadata?: { display_name?: string; role?: UserRole } }) {
  const { data } = await getClient().from("profiles").select("display_name, role").eq("id", user.id).maybeSingle();
  return {
    id: user.id,
    name: data?.display_name ?? user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "ผู้ใช้งาน",
    email: user.email ?? "",
    role: data?.role ?? user.user_metadata?.role ?? "student",
  } satisfies Session;
}

function notify() {
  listeners.forEach((listener) => listener());
}

function initialize() {
  if (initialized) return;
  initialized = true;
  const client = getClient();
  void client.auth.getSession().then(async ({ data }) => {
    sessionSnapshot = data.session?.user ? await loadProfile(data.session.user) : null;
    authReady = true;
    notify();
  });
  client.auth.onAuthStateChange((_event, session) => {
    void (async () => {
      sessionSnapshot = session?.user ? await loadProfile(session.user) : null;
      authReady = true;
      notify();
    })();
  });
}

export function getSession() {
  initialize();
  return sessionSnapshot;
}

export function subscribeToSession(callback: () => void) {
  initialize();
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getServerSession() {
  return null;
}

export function subscribeToClientReady(callback: () => void) {
  initialize();
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getClientReady() {
  initialize();
  return authReady;
}

export function getServerReady() {
  return false;
}

export async function loginUser(email: string, password: string) {
  const { error } = await getClient().auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function registerUser(name: string, email: string, password: string, role: UserRole) {
  const { data, error } = await getClient().auth.signUp({
    email,
    password,
    options: { data: { display_name: name, role } },
  });
  if (error) throw error;
  if (!data.user) throw new Error("สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี");

  if (data.session) {
    const { error: profileError } = await getClient().from("profiles").upsert({ id: data.user.id, display_name: name, role });
    if (profileError) throw profileError;
  }
}

export async function logout() {
  const { error } = await getClient().auth.signOut();
  if (error) throw error;
}
