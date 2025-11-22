import { createServerClient } from "@/lib/supabase/server";

export async function getSession() {
    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export async function getCurrentUser() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
