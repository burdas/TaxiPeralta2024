import { describe, it, expect } from 'vitest';
import { PUT } from '@/pages/api/tarifas';

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
    request: new Request('http://localhost/api/tarifas', {
      method: 'PUT',
      headers: cookie ? { cookie } : {},
    }),
    locals: {},
    redirect: (url: string, status: number = 302) => {
      return new Response(null, {
        status,
        headers: {
          'Location': url
        }
      });
    }
  } as any // simplificamos el tipo para no complicarnos
}

describe('PUT /api/tarifas', () => {
  it('redirige a /unauthorized si no hay cookie', async () => {
    const response = await PUT(createContext());
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
  })

  it('redirige a /unauthorized si la sesión es inválida', async () => {
    const response = await PUT(createContext('session=invalid'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
  })
})
