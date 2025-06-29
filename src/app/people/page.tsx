import AuthGuard from "@/components/auth/auth-guard";
import PeopleContent from "./components/content";

export default function PeoplePage() {
  return (
    <AuthGuard>
      <div className="container mx-auto md:py-8 text-gray-500 p-4 md:p-0">
        <div className="flex justify-between items-center mb-8 bg-muted p-2 rounded-md">
          <div>
            <h1 className="text-lg font-bold">Clientes</h1>
          </div>
        </div>
        <PeopleContent />
      </div>
    </AuthGuard>
  )
}