import { z } from 'zod'

const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url().optional(), // Optional in build time, required in runtime

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

    // TestSprite
    TESTSPRITE_API_KEY: z.string().optional(),

    // Node Environment
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

// Validate environment variables
// We use safeParse to avoid crashing the build if envs are missing in CI/CD pipeline
// unless we are in strict mode
const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format())

    // Only throw error in production or if strictly required
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Invalid environment variables')
    }
}

export const env = _env.success ? _env.data : process.env as unknown as z.infer<typeof envSchema>
