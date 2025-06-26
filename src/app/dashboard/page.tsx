import AuthGuard from "@/components/auth/auth-guard";

export default function Dashboard() {
  return <AuthGuard> dashboard</AuthGuard>;
}