import "server-only";

import { randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";

export const ALLOWED_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

export const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;

function storageRoot(): string {
  return process.env.LOCAL_STORAGE_PATH ?? "storage";
}

function maxUploadBytes(): number {
  const configured = Number(process.env.LOCAL_MAX_UPLOAD_MB);
  return Number.isFinite(configured) && configured > 0
    ? configured * 1024 * 1024
    : DEFAULT_MAX_BYTES;
}

export class StorageError extends Error {
  constructor(
    message: string,
    readonly code:
      | "INVALID_MIME"
      | "FILE_TOO_LARGE"
      | "NOT_FOUND"
      | "INVALID_PATH",
  ) {
    super(message);
    this.name = "StorageError";
  }
}

/** Normaliza una ruta relativa evitando escapes de directorio. */
function sanitizeRelativePath(relativePath: string): string {
  const parts = relativePath.split(/[\\/]/).filter((p) => p !== "" && p !== ".");
  const cleaned: string[] = [];
  for (const part of parts) {
    if (part === "..") continue;
    cleaned.push(part);
  }
  return cleaned.join("/");
}

export interface StoredFile {
  relativePath: string;
  url: string;
  mimeType: string;
  size: number;
}

/** Guarda un archivo local (storage local = futuro Supabase Storage). */
export async function saveFile(input: {
  dir: string;
  buffer: Buffer;
  mimeType: string;
}): Promise<StoredFile> {
  const extension = ALLOWED_MIME_TYPES.get(input.mimeType);
  if (!extension) {
    throw new StorageError(
      `Tipo de archivo no permitido: ${input.mimeType}`,
      "INVALID_MIME",
    );
  }
  if (input.buffer.length > maxUploadBytes()) {
    throw new StorageError(
      "El archivo supera el tamaño máximo permitido",
      "FILE_TOO_LARGE",
    );
  }
  const safeDir = sanitizeRelativePath(input.dir);
  const fileName = `${randomUUID()}.${extension}`;
  const relativePath = `${safeDir}/${fileName}`;
  const absoluteDir = join(process.cwd(), storageRoot(), safeDir);
  await mkdir(absoluteDir, { recursive: true });
  await writeFile(join(absoluteDir, fileName), input.buffer);
  return {
    relativePath,
    url: publicUrl(relativePath),
    mimeType: input.mimeType,
    size: input.buffer.length,
  };
}

export async function readFileFromStorage(
  relativePath: string,
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const safe = sanitizeRelativePath(relativePath);
  const absolute = join(process.cwd(), storageRoot(), safe);
  try {
    const buffer = await readFile(absolute);
    return { buffer, mimeType: mimeTypeFromPath(safe) };
  } catch {
    return null;
  }
}

export async function deleteFileFromStorage(relativePath: string): Promise<void> {
  const safe = sanitizeRelativePath(relativePath);
  const absolute = join(process.cwd(), storageRoot(), safe);
  try {
    await rm(absolute, { force: true });
  } catch {
    // ignore missing files
  }
}

export async function fileSize(relativePath: string): Promise<number> {
  const safe = sanitizeRelativePath(relativePath);
  const absolute = join(process.cwd(), storageRoot(), safe);
  const info = await stat(absolute);
  return info.size;
}

function mimeTypeFromPath(relativePath: string): string {
  const extension = relativePath.split(".").pop()?.toLowerCase() ?? "";
  for (const [mime, ext] of ALLOWED_MIME_TYPES) {
    if (ext === extension) return mime;
  }
  return "application/octet-stream";
}

export function publicUrl(relativePath: string): string {
  const safe = sanitizeRelativePath(relativePath);
  const segments = safe.split("/").map(encodeURIComponent);
  return `/api/uploads/${segments.join("/")}`;
}