import type { Actions } from "./$types";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ request, locals: { supabase }, url }) => {
        const data = await request.formData();
        const email = data.get("email") as string;

        await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: url.origin,
            },
        });

        return redirect(303, "/check-email");
    },
} satisfies Actions;
