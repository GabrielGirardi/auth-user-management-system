import AuthGuard from "@/components/auth/auth-guard";
import { getDashboardData } from "@/lib/dashboard";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface DashboardData {
  totalPeople: number;
  totalUsers: number;
}

export default async function Dashboard() {
  const {
    totalPeople,
    totalUsers
  }: DashboardData = await getDashboardData()

  return (
    <AuthGuard>
      <div className="container mx-auto md:py-8 text-gray-500 p-4 md:p-0">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-lg font-bold">Dashboard</h1>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle>Pessoas cadastradas</CardTitle>
              <CardDescription>Total de pessoas cadastradas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-4xl font-bold">
                { totalPeople }
              </h3>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle>Usuário cadastrados</CardTitle>
              <CardDescription>Total de usuários cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-4xl font-bold">
                { totalUsers }
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}