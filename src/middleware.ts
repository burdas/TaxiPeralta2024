// src/middleware.ts
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
    const { request, url } = context;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'IP no disponible';

    console.log(`Request IP: ${ip} - URL: ${url.href}`);
    return next();
};