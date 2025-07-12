export const baseUrl = () => process.env.NODE_ENV === "production"
    ? import.meta.env.IS_PREVIEW ? "https://taxi-peralta2024-3pc3.vercel.app" : "https://taxiperalta.com"
    : "http://localhost:4321";