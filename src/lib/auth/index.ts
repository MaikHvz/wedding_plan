import "server-only";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Profile, SessionUser } from "@/types";
import { sessionsRepo, usersRepo } from "@/lib/data";
import { hashPassword, verifyPassword } from "./password";

export const SESSION_COOKIE = "wwb_session";
export const SESSION_TTL_DAYS = 30;

export class AuthError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

function issueToken(): string {
  return randomBytes(32).toString("hex");
}

function expiresAt(): string {
  const date = new Date();
  date.setDate(date.getDate() + SESSION_TTL_DAYS);
  return date.toISOString();
}

async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token || null;
}

export async function createSession(userId: string): Promise<SessionUser> {
  const token = issueToken();
  const session = sessionsRepo.create(userId, token, expiresAt());
  await setSessionCookie(token);
  const profile = usersRepo.findById(userId);
  if (!profile) {
    throw new AuthError("Usuario no encontrado", "USER_NOT_FOUND");
  }
  return { session, profile };
}

export async function getCurrentSession(): Promise<SessionUser | null> {
  sessionsRepo.deleteExpired();
  const token = await getTokenFromCookie();
  if (!token) {
    return null;
  }
  const session = sessionsRepo.findByToken(token);
  if (!session) {
    return null;
  }
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    sessionsRepo.deleteByToken(token);
    return null;
  }
  const profile = usersRepo.findById(session.userId);
  if (!profile) {
    return null;
  }
  return { session, profile };
}

export async function getCurrentUser(): Promise<Profile | null> {
  const session = await getCurrentSession();
  return session?.profile ?? null;
}

/** Devuelve el usuario actual o redirige al login si no hay sesión. */
export async function requireUser(): Promise<Profile> {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }
  return session.profile;
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<SessionUser> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!email || !name) {
    throw new AuthError("Nombre y email son obligatorios", "INVALID_INPUT");
  }
  if (input.password.length < 8) {
    throw new AuthError(
      "La contraseña debe tener al menos 8 caracteres",
      "WEAK_PASSWORD",
    );
  }
  if (usersRepo.findByEmail(email)) {
    throw new AuthError("El email ya está registrado", "EMAIL_TAKEN");
  }
  const passwordHash = await hashPassword(input.password);
  const profile = usersRepo.create({ email, name, passwordHash });
  return createSession(profile.id);
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<SessionUser> {
  const email = input.email.trim().toLowerCase();
  const profile = usersRepo.findByEmail(email);
  if (!profile) {
    throw new AuthError("Credenciales inválidas", "INVALID_CREDENTIALS");
  }
  const ok = await verifyPassword(input.password, profile.passwordHash);
  if (!ok) {
    throw new AuthError("Credenciales inválidas", "INVALID_CREDENTIALS");
  }
  return createSession(profile.id);
}

export async function signOut(): Promise<void> {
  const token = await getTokenFromCookie();
  if (token) {
    sessionsRepo.deleteByToken(token);
  }
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}