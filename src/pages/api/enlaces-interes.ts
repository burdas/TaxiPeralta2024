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
        data.push({ id: 99, texto: 'Preguntas frecuentes', url: 'AAA' });

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