import type {APIContext} from "astro";
import {verifySession} from "@/auth/session.ts";
import {baseUrl} from "@/utils/Routes.ts";

export const prerender = false;

export async function PUT(context: APIContext) {
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
    const tarifas = await context.request.json();
    
    const response = await fetch(`${apiUrl}/tarifas`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify(tarifas)
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
    console.error('Error in PUT /api/tarifas:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

import { getTarifas } from "@/services/externalApi.ts";

export async function GET(context: APIContext) {
  try {
    const data = await getTarifas();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (err) {
    console.error('Error in GET /api/tarifas:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}