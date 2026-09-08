import "server-only";

import type { Theme, Wedding } from "@/types";

export interface InvitationEmailInput {
  to: string;
  guestName: string;
  wedding: Wedding;
  theme: Theme;
  token: string;
  baseUrl: string;
  from?: string;
}

function esc(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value: string | null): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Arma el correo de invitación estilizado con los colores del tema de la
 * plantilla de la boda ("la plantilla de boda envía el correo como invitación").
 */
export function buildInvitationEmail(input: InvitationEmailInput): {
  subject: string;
  html: string;
} {
  const tokens = input.theme.tokens ?? {};
  const bg = tokens["t-bg"] ?? "#faf7f2";
  const surface = tokens["t-surface"] ?? "#ffffff";
  const text = tokens["t-text"] ?? "#3d3a36";
  const muted = tokens["t-muted"] ?? "#8a8377";
  const accent = tokens["t-accent"] ?? "#b98a5e";
  const accentSoft = tokens["t-accent-soft"] ?? "#e9d9c8";
  const ctaBg = tokens["t-cta-bg"] ?? "#3d3a36";
  const ctaText = tokens["t-cta-text"] ?? "#ffffff";

  const couple = `${esc(input.wedding.partner1)} & ${esc(input.wedding.partner2)}`;
  const date = formatDate(input.wedding.eventDate);
  const time = esc(input.wedding.eventTime);
  const place = esc(input.wedding.locationName);
  const address = esc(input.wedding.locationAddress);
  const inviteUrl = `${input.baseUrl.replace(/\/$/, "")}/invitacion/${input.token}`;
  const guestName = esc(input.guestName);

  const details = [date, time, place, address].filter(Boolean);
  const detailsHtml = details
    .map(
      (detail) =>
        `<p style="margin:3px 0;font-size:14px;color:${text};">${detail}</p>`,
    )
    .join("");

  const subject = `Invitación a la boda de ${couple}`;

  const html = `<!DOCTYPE html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  </head>
  <body style="margin:0;padding:0;background:${bg};font-family:'Georgia','Times New Roman',serif;color:${text};-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${surface};border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,0.06);">
            <tr>
              <td align="center" style="padding:40px 32px 8px;">
                <p style="margin:0;text-transform:uppercase;letter-spacing:0.35em;font-size:12px;color:${muted};">Invitas a</p>
                <h1 style="margin:12px 0 0;font-size:34px;line-height:1.2;color:${text};font-weight:400;">${guestName}</h1>
                <div style="width:56px;height:2px;background:${accent};margin:20px auto 0;"></div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:28px 32px 8px;">
                <h2 style="margin:0;font-size:26px;line-height:1.3;color:${text};font-weight:400;">${couple}</h2>
                <p style="margin:12px 0 0;font-size:15px;color:${muted};line-height:1.7;">con mucho cariño queremos compartir contigo el día más especial de nuestras vidas.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 32px;">
                <div style="background:${accentSoft};border-radius:12px;padding:18px 24px;width:100%;box-sizing:border-box;">
                  ${date ? `<p style="margin:0 0 6px;font-size:16px;color:${text};font-weight:600;">${date}</p>` : ""}
                  ${detailsHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:8px 32px 32px;">
                <a href="${inviteUrl}" target="_blank" rel="noopener" style="display:inline-block;background:${ctaBg};color:${ctaText};text-decoration:none;padding:14px 36px;border-radius:999px;font-size:15px;letter-spacing:0.02em;">
                  Confirmar mi asistencia
                </a>
                <p style="margin:18px 0 0;font-size:12px;color:${muted};line-height:1.6;">
                  Al confirmar podrás indicar con quién vas y si podrás asistir.
                  Si el botón no funciona, copia y pega este enlace:<br />
                  <span style="font-family:monospace;font-size:11px;">${inviteUrl}</span>
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0;font-size:12px;color:${muted};">Enviado con Web de Boda</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html };
}