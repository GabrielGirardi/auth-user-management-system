import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AuthGuard({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}