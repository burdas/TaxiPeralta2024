import { describe, it, expect } from 'vitest';
import { POST } from '@/pages/api/enlaces-interes/index.ts';
import { PUT, DELETE } from '@/pages/api/enlaces-interes/[id]';

function createContext(method: string = 'POST', cookie?: string) {
  const url = method === 'POST' 
    ? 'http://localhost/api/enlaces-interes'
    : `http://localhost/api/enlaces-interes/123`; // ID de ejemplo para PUT/DELETE
    
  return {
    cookies: {
      get: (name: string) => {
        if (name === 'session') {
          return { value: cookie };
        }
        return undefined;
      }
    },
    request: new Request(url, {
      method,
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
  } as any;
}

describe('POST /api/enlaces-interes', () => {
  it('redirige a /unauthorized si no hay cookie', async () => {
    const response = await POST(createContext());
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
  })

  it('redirige a /unauthorized si la sesión es inválida', async () => {
    const response = await POST(createContext('POST', 'session=invalid'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
  })
})

describe('PUT /api/enlaces-interes/[id]', () => {
  it('redirige a /unauthorized si no hay cookie', async () => {
    const response = await PUT(createContext('PUT'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
  })

  it('redirige a /unauthorized si la sesión es inválida', async () => {
    const response = await PUT(createContext('PUT', 'session=invalid'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
  })
})

describe('DELETE /api/enlaces-interes/[id]', () => {
  it('redirige a /unauthorized si no hay cookie', async () => {
    const response = await DELETE(createContext('DELETE'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
  })

  it('redirige a /unauthorized si la sesión es inválida', async () => {
    const response = await DELETE(createContext('DELETE', 'session=invalid'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/unauthorized');
  })
})
