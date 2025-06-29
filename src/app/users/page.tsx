import AuthGuard from "@/components/auth/auth-guard";
import UsersContent from "./components/content";

export default function UsersPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto md:py-8 text-gray-500 p-4 md:p-0">
        <div className="flex justify-between items-center mb-8 bg-muted p-2 rounded-md">
          <div>
            <h1 className="text-lg font-bold">Usuários</h1>
          </div>
        </div>
        <UsersContent />
      </div>
    </AuthGuard>
  )
}