import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

import bcrypt from "bcryptjs";

/**
 * Manipulação de rotas para a tabela de usuários (users) com operações CRUD.
 *
 * GET: Lista todos os usuários.
 * POST: Cria um novo usuário.
 */
const prisma = new PrismaClient();

/**
 * Lista todos os usuários.
 *
 * @returns Usuários em formato JSON.
 */
export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        not: "admin@teste.com.br",
      },
    },
  });
  return NextResponse.json(users);
}

/**
 * Cria um usuário.
 * Requer os dados do usuário no corpo da requisição.
 * É preciso vincular uma pessoa ao usuário.
 *
 * @param request
 * @returns Usuário criada em formato JSON.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "delete")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const body = await request.json();
  const { name, email, password, role, isActive, validUntil, personId } = body;
  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, role, isActive, validUntil, personId },
  });
  return NextResponse.json(newUser, { status: 201 });
}