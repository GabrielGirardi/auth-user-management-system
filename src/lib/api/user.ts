export type UserPayload = {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'VIEWER';
  isActive: boolean;
  validUntil: string;
  personId: string;
}

export async function getUsers() {
  const res = await fetch('/api/user');

  if (!res.ok) {
    throw new Error('Erro ao buscar usuários');
  }

  return res.json();
}

export async function saveUser(
  data: UserPayload,
  id?: string | undefined
) {
  const method = id ? 'PUT' : 'POST';
  const endpoint = id ? `/api/user/${id}` : '/api/user';

  const res = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erro ao salvar o usuário');
  }

  return res.json();
}

export async function changeUserStatus(id: string, isActive: boolean) {
  const res = await fetch(`/api/user/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) {
    throw new Error('Erro ao alterar o status do usuário');
  }

  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`/api/user/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Erro ao excluir o usuário');
  }

  return res.json();
}