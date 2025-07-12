import fs from 'fs/promises';
import type { APIRoute } from 'astro';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const GET: APIRoute = async () => {
    try {
        const filePath = join(__dirname, 'fake_visitas.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const datos = JSON.parse(fileContent);

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
