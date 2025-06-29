import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getRouteParam } from "@/lib/utils/url";

/**
 * Manipulação de rotas dinâmicas para pessoas (people) com operações CRUD.
 *
 * PUT: Atualiza uma pessoa existente.
 * DELETE: Deleta uma pessoa existente.
 * PATCH: Atualiza o status de uma pessoa existente.
 */
const prisma = new PrismaClient();

/**
 * Atualiza uma pessoa existente.
 * Requer o ID da pessoa na URL e os dados atualizados no corpo da requisição.
 *
 * @param request
 * @constructor
 */
export async function PUT(request: NextRequest) {
  const id = getRouteParam(request);

  if (!id) {
    return NextResponse.json({ message: "ID ausente na URL" }, { status: 400 });
  }

  const { name, cpf, birthDate, isActive } = await request.json();

  const updated = await prisma.person.update({
    where: { id: String(id) },
    data: { name, cpf, birthDate, isActive },
  });

  return NextResponse.json(updated);
}

/**
 * Deleta uma pessoa existente.
 * Requer o ID da pessoa na URL.
 *
 * @param request
 * @constructor
 */
export async function DELETE(request: NextRequest) {
  const id = getRouteParam(request);

  if (!id) {
    return NextResponse.json({ message: "ID ausente na URL" }, { status: 400 });
  }

  await prisma.person.delete({
    where: { id: String(id) },
  });

  return NextResponse.json({ message: "Pessoa deletada com sucesso" });
}

/**
 * Atualiza o status de uma pessoa existente.
 * Requer o ID da pessoa na URL e o novo status no corpo da requisição.
 *
 * @param request
 * @constructor
 */
export async function PATCH(request: NextRequest) {
  const id = getRouteParam(request);

  if (!id) {
    return NextResponse.json({ message: "ID ausente na URL" }, { status: 400 });
  }

  const exists = await prisma.person.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Pessoa não encontrada" }, { status: 404 });
  }

  const { isActive } = await request.json();

  const updated = await prisma.person.update({
    where: { id: String(id) },
    data: { isActive },
  });

  return NextResponse.json(updated);
}