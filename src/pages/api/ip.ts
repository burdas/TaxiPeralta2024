import type {APIContext} from "astro";

export const prerender = false;

export async function GET(context: APIContext) {
    const { request } = context;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'IP no disponible';

    return new Response(JSON.stringify({ ip }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}