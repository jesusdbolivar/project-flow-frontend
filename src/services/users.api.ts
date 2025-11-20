export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

const BASE = '/api/users';

export async function listUsers(): Promise<UserSummary[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Error listando usuarios');
  return res.json();
}

export async function createUser(data: { name: string; email: string }): Promise<UserSummary> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error creando usuario');
  return res.json();
}
