import type { Actions } from "./$types";
import { PUBLIC_URL } from "$env/static/public";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ request, locals: { supabase } }) => {
        const data = await request.formData();
        const email = data.get("email") as string;

        await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: PUBLIC_URL,
            }
        });

        return redirect(303, "/check-email");
    }
} satisfies Actions;
