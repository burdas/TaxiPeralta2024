import { Google } from "arctic";
import { baseUrl } from "@/utils/Routes.ts"

export const google = new Google(
	import.meta.env.GOOGLE_CLIENT_ID,
	import.meta.env.GOOGLE_CLIENT_SECRET,
	`${baseUrl()}/login/callback`
);
