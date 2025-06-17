import type { APIContext } from "astro";
import { verifySession } from "@/auth/session.ts";

export const prerender = false;

export async function GET() {
    const apiUrl = import.meta.env.TAXI_PERALTA_API_URL;
    const apiKey = import.meta.env.TAXI_PERALTA_API_KEY;

    if (!apiUrl || !apiKey) {
        console.error('API URL or API KEY not set in environment variables.');
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }

    try {
        const response = await fetch(`${apiUrl}/enlaces-interes`, {
            headers: {
                'X-Api-Key': apiKey,
            }
        });
        if (!response.ok) {
            return new Response(await response.text());
        }
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), { status: 500 });
    }
}

export async function POST(context: APIContext) {
    const apiUrl = import.meta.env.TAXI_PERALTA_API_URL;
    const apiKey = import.meta.env.TAXI_PERALTA_API_KEY;

    if (!apiUrl || !apiKey) {
        console.error('API URL or API KEY not set in environment variables.');
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }

    const session = context.cookies.get('session')?.value;
    if (!session || !verifySession(session)) {
        return context.redirect('/unauthorized', 307);
    }

    try {
        const enlaceData = await context.request.json();
        console.log(enlaceData);
        
        const response = await fetch(`${apiUrl}/enlaces-interes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify(enlaceData)
        });

        if (!response.ok) {
            return new Response(await response.text(), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), { status: 500 });
    }
}
