import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
    try {
        const url = new URL('/fake-visitas.json', request.url);
        const res = await fetch(url.href);
        const datos = await res.json();

        return new Response(JSON.stringify(datos), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ error: 'No se pudieron leer los datos' }),
            { status: 500 }
        );
    }
};
