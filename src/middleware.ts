import type { MiddlewareHandler } from "astro";

const ALLOWED_ORIGIN = "https://taxiperalta.com";

export const onRequest: MiddlewareHandler = async ({ request }, next) => {
    if (import.meta.env.MODE === "development" || import.meta.env.OUTPUT === "static") {
        return next();
    }

    const origin = request.headers.get("origin");

    if (!origin || origin !== ALLOWED_ORIGIN) {
        return new Response(JSON.stringify({ error: "Acceso no autorizado" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

    return next();
};
