import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "./prisma";

export async function getDashboardData() {
  noStore();

  try {
    const [
      totalPeople,
      totalUsers
    ] = await Promise.all([
      prisma.person.count(),
      prisma.user.count({
        where: {
          email: {
            not: "admin@teste.com.br",
          },
        },
      }),
    ]);

    return {
      totalPeople,
      totalUsers
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return {
      totalPeople: 0,
      totalUsers: 0
    }
  }
}