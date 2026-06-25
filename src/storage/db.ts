import { neon } from "@neondatabase/serverless";

// Reuse a single connection across Vercel serverless invocations
const sql = neon(process.env.DATABASE_URL!);

export default sql;
