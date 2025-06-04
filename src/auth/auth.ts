import { Google } from "arctic";

export const google = new Google(
	import.meta.env.GOOGLE_CLIENT_ID,
	import.meta.env.GOOGLE_CLIENT_SECRET,
	"https://taxi-peralta2024-3pc3.vercel.app/login/callback"
);
