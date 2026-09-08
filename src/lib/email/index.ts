import "server-only";

/**
 * Capa de email (m09, plan.md §66).
 *
 * Por ahora NO gestionamos ningún proveedor de correo: se deja la abstracción
 * preparada (ADR-007) y todas las notificaciones se registran por consola
 * (proveedor local simulado). Al desplegar, se sustituye el proveedor por uno
 * transaccional real (Resend/SES/etc.) sin tocar el resto del sistema.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailProvider {
  /** Envía un correo. Lanza si no se pudo enviar. */
  send(message: EmailMessage): Promise<void>;
  readonly name: string;
}

export class EmailError extends Error {
  constructor(
    message: string,
    readonly code: "NO_PROVIDER" | "SEND_FAILED" | "INVALID_RECIPIENT",
  ) {
    super(message);
    this.name = "EmailError";
  }
}

/**
 * Proveedor local que solo registra el correo (no envía nada).
 * Sirve en desarrollo y como base para el proveedor real.
 */
export function createConsoleEmailProvider(): EmailProvider {
  return {
    name: "console",
    async send(message: EmailMessage): Promise<void> {
      if (!message.to || !message.to.includes("@")) {
        throw new EmailError(
          `Destinatario inválido: ${message.to}`,
          "INVALID_RECIPIENT",
        );
      }
      console.log(
        `[email:console] → ${message.to}\n` +
          `  asunto: ${message.subject}\n` +
          `  html:   ${message.html.length} caracteres`,
      );
    },
  };
}

let cachedProvider: EmailProvider | null = null;

/**
 * Devuelve el proveedor configurado por env `EMAIL_PROVIDER`
 * (hoy, cualquier valor = consola). Si mañana se integra Resend/SES:
 * switch (EMAIL_PROVIDER) { case "resend": return supabase//resend... }
 */
export function getEmailProvider(): EmailProvider {
  const configured = process.env.EMAIL_PROVIDER ?? "console";
  if (!cachedProvider) {
    if (configured === "console" || !configured) {
      cachedProvider = createConsoleEmailProvider();
    } else {
      cachedProvider = createConsoleEmailProvider();
    }
  }
  return cachedProvider;
}

/** Envía un correo usando el proveedor configurado. */
export async function sendEmail(message: EmailMessage): Promise<void> {
  await getEmailProvider().send(message);
}