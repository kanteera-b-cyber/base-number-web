export type UserRole = "student" | "teacher" | "admin";

export type StoredUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export const roleLabels: Record<UserRole, string> = {
  student: "นักเรียน",
  teacher: "ครู",
  admin: "แอดมิน",
};

const usersKey = "base-number-users";
const sessionKey = "base-number-session";
type Session = Pick<StoredUser, "name" | "email" | "role">;
let sessionSnapshot: Session | null | undefined;

export function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(usersKey) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

export function saveUser(user: StoredUser) {
  localStorage.setItem(usersKey, JSON.stringify([...getUsers(), user]));
}

export function setSession(user: StoredUser) {
  sessionSnapshot = { name: user.name, email: user.email, role: user.role };
  localStorage.setItem(sessionKey, JSON.stringify(sessionSnapshot));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  if (sessionSnapshot !== undefined) return sessionSnapshot;

  try {
    sessionSnapshot = JSON.parse(localStorage.getItem(sessionKey) ?? "null") as Session | null;
  } catch {
    sessionSnapshot = null;
  }

  return sessionSnapshot;
}

export function clearSession() {
  sessionSnapshot = null;
  localStorage.removeItem(sessionKey);
}

export function subscribeToSession(callback: () => void) {
  function handleStorageChange() {
    sessionSnapshot = undefined;
    callback();
  }

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}

export function getServerSession() {
  return null;
}

export function subscribeToClientReady() {
  return () => undefined;
}

export function getClientReady() {
  return true;
}

export function getServerReady() {
  return false;
}