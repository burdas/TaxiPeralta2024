import type { APIContext } from "astro";
import { createHmac } from "node:crypto";

function signSession(id: string, secret: string): string {
	const hmac = createHmac("sha256", secret);
	hmac.update(id);
	const signature = hmac.digest("hex");
	return `${id}.${signature}`;
}

export function verifySession(token: string): string | null {
	const [id, signature] = token.split(".");
	if (!id || !signature) return null;

	const expected = createHmac("sha256", import.meta.env.SECRET_SESSION_TOKEN)
        .update(id)
        .digest("hex");
	if (expected === signature) {
		return id // autenticado
	}
	return null; // inválido
}

export function createSession(context: APIContext, id: string){
    context.cookies.set("session", signSession(id, import.meta.env.SECRET_SESSION_TOKEN), {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30 // 30 días
    });
}

export function deleteSession(context: APIContext) {
    context.cookies.set("session", "", {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        path: "/",
        maxAge: 0 // elimina la cookie inmediatamente
    });
}