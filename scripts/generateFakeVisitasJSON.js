// scripts/fetch-and-save.js

import { writeFile } from 'fs/promises';

const url = 'http://localhost:4321/api/visitas'; // tu URL de datos

async function fetchAndSave() {
    try {
        const response = await fetch(url); // fetch nativo en Node 18+
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

        const data = await response.json();

        await writeFile('./public/fake-visitas.json', JSON.stringify(data, null, 2)); // lo guardas en la carpeta pública
        console.log('✅ Datos guardados en public/fake-visitas.json');
    } catch (err) {
        console.error('❌ Error al hacer fetch o guardar:', err);
    }
}

fetchAndSave();
