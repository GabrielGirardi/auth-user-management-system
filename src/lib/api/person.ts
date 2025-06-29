export type PersonPayload = {
  name: string;
  cpf: string;
  birthDate: string;
  isActive: boolean;
}

export async function getPeople() {
  const res = await fetch('/api/person');

  if (!res.ok) {
    throw new Error('Erro ao buscar Pessoas');
  }

  return res.json();
}

export async function savePerson(
  data: PersonPayload,
  id?: string | undefined
) {
  const method = id ? 'PUT' : 'POST';
  const endpoint = id ? `/api/person/${id}` : '/api/person';

  const res = await fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erro ao salvar a pessoa');
  }

  return res.json();
}

export async function changePersonStatus(id: string, isActive: boolean) {
  const res = await fetch(`/api/person/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) {
    throw new Error('Erro ao alterar o status da pessoa');
  }

  return res.json();
}

export async function deletePerson(id: string) {
  const res = await fetch(`/api/person/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Erro ao excluir a pessoa');
  }

  return res.json();
}