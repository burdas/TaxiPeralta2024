import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/pages/api/logout';
import { deleteSession, verifySession } from '@/auth/session';

// Mock de las funciones de autenticación
vi.mock('@/auth/session', () => ({
  verifySession: vi.fn(),
  deleteSession: vi.fn()
}));

function createContext(cookie?: string) {
  return {
    cookies: {
      get: (name: string) => {
        if (name === 'session') {
          return { value: cookie };
        }
        return undefined;
      }
    },
    request: new Request('http://localhost/api/logout', {
      method: 'POST',
      headers: cookie ? { cookie } : {},
    }),
    redirect: (url: string, status: number = 302) => {
      return new Response(null, {
        status,
        headers: {
          'Location': url
        }
      });
    }
  } as any; // simplificamos el tipo para no complicarnos
}

describe('POST /api/logout', () => {
  it('redirige a /unauthorized si no hay cookie', async () => {
    const context = createContext();
    const response = await POST(context);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
    expect(deleteSession).not.toHaveBeenCalled();
  });

  it('redirige a /unauthorized si la sesión es inválida', async () => {
    const context = createContext('session=invalid');
    const response = await POST(context);
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
    expect(deleteSession).not.toHaveBeenCalled();
  });
});
