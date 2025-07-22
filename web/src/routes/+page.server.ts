import type { Actions } from "./$types";

export const actions = {
    default: async ({ request, locals: { supabase } }) => {
        const data = await request.formData();
        const email = data.get("email") as string;

        await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: "http://localhost:5173"
            }
        });
    }
} satisfies Actions;
