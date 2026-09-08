import { randomUUID } from "node:crypto";

export function newId(): string {
  return randomUUID();
}

export function now(): string {
  return new Date().toISOString();
}

export function toBool(value: number | bigint | null | undefined): boolean {
  return Boolean(value);
}

export function fromBool(value: boolean): 0 | 1 {
  return value ? 1 : 0;
}

export function orNull<T>(value: T | null | undefined): T | null {
  return value ?? null;
}

/** Token aleatorio de invitación (enlace de RSVP): 32 bytes hexísticos. */
export function randomToken(): string {
  return randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
}