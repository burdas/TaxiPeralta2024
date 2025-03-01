export const prerender = false;

import type { MiddlewareHandler } from "astro";

const ALLOWED_ORIGINS = [
    "https://taxiperalta.com",
    "https://taxi-peralta2024-3pc3.vercel.app/"
];

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
    if (import.meta.env.MODE === "development" || import.meta.env.OUTPUT === "static") {
        return next();
    }

    const origin = request.headers.get("origin") || request.headers.get("referer");

    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return new Response(JSON.stringify({ error: `Acceso no autorizado ${origin}` }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    return next();
};
