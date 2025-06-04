import type {APIContext} from "astro";
import {verifySession} from "@/auth/session.ts";

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
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), { status: 500 });
  }
}

export async function GET() {
  const apiUrl = import.meta.env.TAXI_PERALTA_API_URL;
  const apiKey = import.meta.env.TAXI_PERALTA_API_KEY;
  console.log(apiUrl, apiKey);


  if (!apiUrl || !apiKey) {
    console.error('API URL or API KEY not set in environment variables.');
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }

  try {
    const response = await fetch(`${apiUrl}/tarifas`, {
      headers: {
        'X-Api-Key': apiKey,
      }
    });
    if (!response.ok) {
      return new Response(await response.text());
    }
    const data = await response.json();

    let maxDate: string | number | Date | null = null;
    const output: { [key: string]: { [key: string]: number } } = Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          const newInner: { [key: string]: number } = {};
          for (const [innerKey, innerValue] of Object.entries(value as Record<string, { value: number; date: string }>)) {
            const { value: val, date } = innerValue;
            newInner[innerKey] = val;
            if (!maxDate || new Date(date) > new Date(maxDate)) {
              maxDate = date;
            }
          }
          return [key, newInner];
        })
      );

    console.log(JSON.stringify({ ...output, date: maxDate }));
    return new Response(JSON.stringify({ ...output, date: maxDate }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), { status: 500 });
  }
}