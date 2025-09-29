import { Config, defineConfig } from "drizzle-kit";

export default defineConfig(
    {
        schema: "./src/db/schema.ts",
        out: "./supabase/migrations",
        dialect: "postgresql",
        migrations: {
            // Use Supabase-compatible timestamped filenames, e.g. 20250101010101_name.sql
            prefix: "supabase",
        },
        dbCredentials: {
            url: process.env.DATABASE_URL!,
        },
    } satisfies Config,
);
