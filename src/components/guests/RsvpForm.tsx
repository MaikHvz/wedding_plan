"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import type { RsvpAttendance } from "@/types";
import { submitRsvpAction } from "@/app/invitacion/[token]/actions";
import type { RsvpActionResult } from "@/app/invitacion/[token]/actions";

export interface RsvpFormProps {
  token: string;
  guestName: string;
  /** Cupos libres para este invitado; `null` = sin límite. */
  remaining: number | null;
  existing: {
    attendance: RsvpAttendance | null;
    companions: string[];
    message: string | null;
  } | null;
  colors: {
    accent: string;
    surface: string;
    text: string;
    muted: string;
    ctaBg: string;
    ctaText: string;
    accentSoft: string;
  };
}

const inputBase: CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.14)",
  padding: "10px 12px",
  fontSize: 14,
  color: "inherit",
  background: "#fff",
  outline: "none",
};

export function RsvpForm({
  token,
  guestName,
  remaining,
  existing,
  colors,
}: RsvpFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    RsvpActionResult | null,
    FormData
  >(submitRsvpAction, null);

  const [done, setDone] = useState(false);
  const [attendance, setAttendance] = useState<RsvpAttendance>(
    existing?.attendance ?? "yes",
  );
  const [companions, setCompanions] = useState<string[]>(
    existing?.companions ?? [],
  );

  const prevOk = useRef(false);
  useEffect(() => {
    if (state?.ok && !prevOk.current) {
      prevOk.current = true;
      setDone(true);
    }
    if (state && !state.ok) {
      prevOk.current = false;
    }
  }, [state]);

  useEffect(() => {
    if (done) {
      router.refresh();
    }
  }, [done, router]);

  const canAddCompanion =
    remaining === null || 1 + companions.length < remaining;

  function updateCompanion(index: number, value: string) {
    setCompanions((current) =>
      current.map((item, position) => (position === index ? value : item)),
    );
  }

  function addCompanion() {
    if (!canAddCompanion) {
      return;
    }
    setCompanions((current) => [...current, ""]);
  }

  function removeCompanion(index: number) {
    setCompanions((current) => current.filter((_, position) => position !== index));
  }

  function handleSubmit(formData: FormData) {
    formData.set("token", token);
    formData.set("companions", JSON.stringify(companions));
    formAction(formData);
  }

  if (done && state?.ok) {
    return (
      <div
        style={{
          background: colors.surface,
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 16,
          padding: 28,
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
        }}
        role="status"
      >
        <div
          style={{
            width: 44,
            height: 44,
            margin: "0 auto 12px",
            borderRadius: "50%",
            background: colors.accentSoft,
            color: colors.accent,
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {attendance === "yes" ? "✓" : "—"}
        </div>
        <h2 style={{ margin: 0, fontSize: 20, color: colors.text }}>
          {attendance === "yes" ? "¡Confirmaste tu asistencia!" : "Respuesta registrada"}
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: colors.muted }}>
          {state.message}
        </p>
        {attendance === "yes" && companions.length > 0 && (
          <p style={{ margin: "10px 0 0", fontSize: 13, color: colors.muted }}>
            Vas con: {companions.join(", ")}
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            prevOk.current = false;
            setDone(false);
          }}
          style={{
            marginTop: 18,
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.2)",
            padding: "9px 20px",
            fontSize: 13,
            color: colors.text,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Cambiar mi respuesta
        </button>
      </div>
    );
  }

  return (
    <form
      action={handleSubmit}
      style={{
        background: colors.surface,
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: 28,
        textAlign: "left",
        boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
      }}
    >
      <input type="hidden" name="token" value={token} />

      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: colors.text,
            marginBottom: 10,
          }}
        >
          ¿Asistirás a la boda, {guestName}?
        </legend>
        <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
          {(
            [
              { value: "yes", label: "Sí, asistiré" },
              { value: "no", label: "No podré asistir" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: `1px solid ${
                  attendance === option.value ? colors.accent : "rgba(0,0,0,0.12)"
                }`,
                background:
                  attendance === option.value ? colors.accentSoft : colors.surface,
                borderRadius: 10,
                padding: "12px 14px",
                cursor: "pointer",
                fontSize: 14,
                color: colors.text,
              }}
            >
              <input
                type="radio"
                name="attendance"
                value={option.value}
                checked={attendance === option.value}
                onChange={() => setAttendance(option.value)}
                style={{ accentColor: colors.accent }}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {attendance === "yes" && (
        <div style={{ marginTop: 20 }}>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: colors.muted }}>
            Con quién vas
            {remaining !== null
              ? ` — quedan ${remaining} cupo${remaining === 1 ? "" : "s"}`
              : ""}
            :
          </p>
          {companions.map((companion, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: 8, marginBottom: 8 }}
            >
              <input
                aria-label="Nombre del acompañante"
                value={companion}
                onChange={(event) => updateCompanion(index, event.target.value)}
                placeholder={`Acompañante ${index + 1}`}
                style={inputBase}
              />
              <button
                type="button"
                onClick={() => removeCompanion(index)}
                style={{
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.12)",
                  padding: "0 12px",
                  fontSize: 13,
                  color: colors.text,
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                Quitar
              </button>
            </div>
          ))}
          {canAddCompanion ? (
            <button
              type="button"
              onClick={addCompanion}
              style={{
                border: "none",
                background: "transparent",
                color: colors.accent,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
              }}
            >
              + Agregar acompañante
            </button>
          ) : (
            <p style={{ margin: 0, fontSize: 12, color: colors.muted }}>
              Llegaste al límite de cupos para tu familia.
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <label
          htmlFor="rsvp-message"
          style={{ fontSize: 13, color: colors.muted, display: "block", marginBottom: 6 }}
        >
          Mensaje para los novios (opcional)
        </label>
        <textarea
          id="rsvp-message"
          name="message"
          rows={2}
          defaultValue={existing?.message ?? ""}
          placeholder="¡Felicitaciones!"
          style={{ ...inputBase, resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      {state && !state.ok && state.error && (
        <p
          role="alert"
          style={{
            margin: "14px 0 0",
            fontSize: 13,
            color: "#b3261e",
          }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: 20,
          width: "100%",
          borderRadius: 999,
          border: "none",
          padding: "13px 24px",
          fontSize: 15,
          fontWeight: 600,
          color: colors.ctaText,
          background: colors.ctaBg,
          cursor: pending ? "wait" : "pointer",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? "Enviando..." : "Confirmar asistencia"}
      </button>
    </form>
  );
}