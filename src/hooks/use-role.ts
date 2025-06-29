import { getSession } from "@/lib/auth";

export async function useRole() {
  const session = await getSession();
  const role = session?.user?.role;

  return {
    isAdmin: role === "ADMIN",
    isViewer: role === "VIEWER",
    role,
  };
}