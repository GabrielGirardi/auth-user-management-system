import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { getRouteParam } from "@/lib/utils/url";
import { canAccess } from "@/lib/permissions";
import { getSession } from "@/lib/auth";

/**
 * Manipulação de rotas dinâmicas para usuários (users) com operações CRUD.
 *
 * PUT: Atualiza um usuário existente.
 * DELETE: Deleta um usuário existente.
 * PATCH: Atualiza o status de um usuário existente.
 */
const prisma = new PrismaClient();

/**
 * Atualiza um usuário existente.
 * Requer o ID do usuário na URL e os dados atualizados no corpo da requisição.
 *
 * @param request
 * @constructor
 */
export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "edit")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const id = getRouteParam(request);
  if (!id) {
    return NextResponse.json({ message: "ID ausente na URL" }, { status: 400 });
  }

  const { name, email, password, role, personId, validUntil, isActive } = await request.json();

  const updated = await prisma.user.update({
    where: { id: String(id) },
    data: { name, email, password, role, personId, validUntil, isActive },
  });

  return NextResponse.json(updated);
}

/**
 * Deleta um usuário existente.
 * Requer o ID do usuário na URL.
 *
 * @param request
 * @constructor
 */
export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "delete")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const id = getRouteParam(request);
  if (!id) {
    return NextResponse.json({ message: "ID ausente na URL" }, { status: 400 });
  }

  await prisma.user.delete({
    where: { id: String(id) },
  });

  return NextResponse.json({ message: "Usuário deletado com sucesso" });
}

/**
 * Atualiza o status de um usuário existente.
 * Requer o ID do usuário na URL e o novo status no corpo da requisição.
 *
 * @param request
 * @constructor
 */
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || !canAccess(session.user.role, "edit")) {
    return new Response("Acesso negado", { status: 403 });
  }

  const id = getRouteParam(request);
  if (!id) {
    return NextResponse.json({ message: "ID ausente na URL" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { id: String(id) } });

  if (!exists) {
    return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
  }

  const { isActive } = await request.json();

  const updated = await prisma.user.update({
    where: { id: String(id) },
    data: { isActive },
  });

  return NextResponse.json(updated);
}