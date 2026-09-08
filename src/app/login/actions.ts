"use server";

import { AuthError, signIn, signUp } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface LoginState {
  message?: string;
}

export async function authenticate(
  _prev: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const mode = String(formData.get("mode") ?? "signin");
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    if (mode === "signup") {
      await signUp({ name, email, password });
    } else {
      await signIn({ email, password });
    }
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: error.message };
    }
    return { message: "Ocurrió un error inesperado. Intenta nuevamente." };
  }

  redirect("/dashboard");
}