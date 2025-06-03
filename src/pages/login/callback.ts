export const prerender = false;
import { google } from "@/auth/auth.ts";
import { decodeIdToken, type OAuth2Tokens } from "arctic";
import type { APIContext } from "astro";
import { createSession } from "@/auth/session.ts";

interface Claims {
	sub: string;
	name: string;
	picture: string;
	email: string;
}

const ALLOWED_EMAILS = ['burdasparmarcos@gmail.com','taxi1peralta@gmail.com']

export async function GET(context: APIContext): Promise<Response> {
	const storedState = context.cookies.get("google_oauth_state")?.value ?? null;
	const codeVerifier = context.cookies.get("google_code_verifier")?.value;
	const code = context.url.searchParams.get("code") ?? '';
	const state = context.url.searchParams.get("state");

	if (storedState === null || codeVerifier === null || code === null || state === null) {
		return new Response("Algo ha ido mal. Vuélvelo a intentar", {
			status: 400
		});
	}
	if (storedState !== state) {
		return new Response("Algo ha ido mal. Vuélvelo a intentar", {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier!);
	} catch (e) {
		return new Response("Algo ha ido mal. Vuélvelo a intentar", {
			status: 400
		});
	}

	const claims = decodeIdToken(tokens.idToken()) as Claims;

	const googleId = claims.sub;
	const email = claims.email;

	if (!ALLOWED_EMAILS.includes(email)){
		return context.redirect('/unauthorized', 307);
	}

	createSession(context, googleId);

	return context.redirect('/admin');
}
