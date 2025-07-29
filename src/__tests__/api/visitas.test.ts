import { describe, it, expect } from 'vitest';
import { GET } from '@/pages/api/visitas';

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
        request: new Request('http://localhost/api/visitas', {
            method: 'GET',
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

describe('GET /api/visitas', () => {
    it('redirige a /unauthorized si no hay cookie', async () => {
        const response = await GET(createContext());
        expect(response.status).toBe(307);
        expect(response.headers.get('location')).toBe('/unauthorized');
    })

    it('redirige a /unauthorized si la sesión es inválida', async () => {
        const response = await GET(createContext('session=invalid'));
        expect(response.status).toBe(307);
        expect(response.headers.get('location')).toBe('/unauthorized');
    })
})
