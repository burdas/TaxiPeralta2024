import { Google } from "arctic";

const baseUrl =
	process.env.NODE_ENV === "production"
		? import.meta.env.IS_PREVIEW ? "https://taxi-peralta2024-3pc3.vercel.app" : "https://taxiperalta.com"
		: "http://localhost:4321";

console.log(baseUrl);

export const google = new Google(
	import.meta.env.GOOGLE_CLIENT_ID,
	import.meta.env.GOOGLE_CLIENT_SECRET,
	`${baseUrl}/login/callback`
);
