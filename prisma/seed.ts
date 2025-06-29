import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  const hashedPassword = await bcrypt.hash("07L5s![UqI!3", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@teste.com.br" },
    update: {},
    create: {
      email: "admin@teste.com.br",
      name: "Administrador",
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log("✅ Usuário administrador criado:", {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
  })

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📋 Usuário criado:");
  console.log("┌────────────────────────────────────────────────────────────────────────────┐");
  console.log("│ Email                              │ Senha        │ Nome                   │");
  console.log("├────────────────────────────────────────────────────────────────────────────┤");
  console.log("│ admin@teste.com.br                 │ 07L5s![UqI!3 │ Administrador          │");
  console.log("└────────────────────────────────────────────────────────────────────────────┘");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
