import type { APIContext } from "astro";
import {deleteSession, verifySession} from "@/auth/session.ts";

export function POST(context: APIContext): Response {
    const session = context.cookies.get('session')?.value;
    if (!session || !verifySession(session)) {
        return context.redirect('/unauthorized', 307);
    }
    
    deleteSession(context);
    return context.redirect('/');
}
