import type { APIRoute } from 'astro';
import {verifySession} from "@/auth/session.ts";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
    const session = cookies.get('session')?.value;
    if (!session || !verifySession(session)) {
        return redirect('/unauthorized', 307);
    }

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
        console.error(error);
        return new Response(
            JSON.stringify({ error: 'No se pudieron leer los datos' }),
            { status: 500 }
        );
    }
};
