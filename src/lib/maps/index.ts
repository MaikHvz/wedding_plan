/**
 * Validación de URLs de Google Maps/Drive (sin credenciales).
 * Módulo consumible en servidor y cliente (lo usa el renderer dentro del Builder).
 */

const GOOGLE_MAPS_HOSTS = [
  "maps.google.com",
  "www.google.com",
  "maps.app.goo.gl",
  "goo.gl",
];

const GOOGLE_DRIVE_HOSTS = ["drive.google.com"];

export interface ParsedUrl {
  isGoogleMaps: boolean;
  isGoogleDrive: boolean;
  isHttps: boolean;
}

export function parseExternalUrl(url: string): ParsedUrl {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { isGoogleMaps: false, isGoogleDrive: false, isHttps: false };
  }
  const isHttps = parsed.protocol === "https:";
  const isGoogleMaps = GOOGLE_MAPS_HOSTS.includes(parsed.hostname);
  const isGoogleDrive = GOOGLE_DRIVE_HOSTS.includes(parsed.hostname);
  return { isGoogleMaps, isGoogleDrive, isHttps };
}

export function isGoogleMapsUrl(url: string): boolean {
  const parsed = parseExternalUrl(url);
  return parsed.isHttps && parsed.isGoogleMaps;
}

export function isGoogleDriveUrl(url: string): boolean {
  const parsed = parseExternalUrl(url);
  return parsed.isHttps && parsed.isGoogleDrive;
}

/** Valida una URL de mapa o drive. Devuelve un mensaje de error o null si es válida. */
export function validateMapsOrDriveUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }
  const parsed = parseExternalUrl(url);
  if (!parsed.isHttps) {
    return "La URL debe ser HTTPS";
  }
  if (!parsed.isGoogleMaps && !parsed.isGoogleDrive) {
    return "Ingresa un enlace válido de Google Maps o Google Drive";
  }
  return null;
}