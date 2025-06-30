import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas para a tabela de pessoas (people) com operações CRUD.
 *
 * GET: Lista todos as pessoas.
 * POST: Cria uma nova pessoa.
 */
const prisma = new PrismaClient();

/**
 * Lista todas as pessoas.
 *
 * @returns Pessoas em formato JSON.
 */
export async function GET() {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "view")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const people = await prisma.person.findMany();
  return NextResponse.json(people);
}

/**
 * Cria uma pessoa.
 * Requer os dados da pessoa no corpo da requisição.
 * O corpo deve conter os campos: name, cpf e birthDate.
 *
 * @param request
 * @returns Pessoa criada em formato JSON.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "create")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const body = await request.json();
  const { name, cpf, birthDate, isActive } = body;
  const newPeson = await prisma.person.create({
    data: { name, cpf, birthDate, isActive },
  });
  return NextResponse.json(newPeson, { status: 201 });
}