import {
  http,
  HttpResponse,
} from 'msw';

// Tipar el cuerpo esperado para creación de usuario
interface CreateUserBody {
  name?: string;
  email?: string;
}

let users: Array<{ id: string; name: string; email: string }> = [
  { id: 'u-1', name: 'Alice', email: 'alice@example.com' },
  { id: 'u-2', name: 'Bob', email: 'bob@example.com' },
];

export const usersHandlers = [
  http.get('/api/users', () => HttpResponse.json(users)),
  http.post('/api/users', async ({ request }) => {
    const raw = await request.json();
    // Validar que el body sea un objeto
    if (!raw || typeof raw !== 'object') {
      return HttpResponse.json({ message: 'Invalid body' }, { status: 400 });
    }
    const body = raw as CreateUserBody;
    const id = `u-${Date.now()}`;
    const user = {
      id,
      name: body.name?.trim() || 'No Name',
      email: body.email?.trim() || '',
    };
    users.push(user);
    return HttpResponse.json(user, { status: 201 });
  }),
];
