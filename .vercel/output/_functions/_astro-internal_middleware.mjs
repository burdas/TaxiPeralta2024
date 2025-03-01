import 'es-module-lexer';
import './chunks/astro-designed-error-pages_Cu9wF_ks.mjs';
import 'kleur/colors';
import './chunks/astro/server_BBGkZF-Y.mjs';
import 'clsx';
import 'cookie';
import { s as sequence } from './chunks/index_D8_lTmc2.mjs';

const ALLOWED_ORIGINS = [
  "https://taxiperalta.com",
  "https://taxi-peralta2024-3pc3.vercel.app/"
];
const onRequest$1 = async ({ request }, next) => {
  const origin = request.headers.get("origin") || request.headers.get("referer");
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: `Acceso no autorizado ${origin}` }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  return next();
};

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
