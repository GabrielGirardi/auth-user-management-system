"use server"

import { redirect } from "next/navigation";
import { login, logout } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const result = await login(formData);

  if ("error" in result) {
    return { error: result.error };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
