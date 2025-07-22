import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { LayoutLoad } from "./$types";
import {
    createBrowserClient,
    createServerClient,
    isBrowser
} from "@supabase/ssr";

function supabaseBrowser() {
    return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
        global: {
            fetch
        }
    });
}

function supabaseServer(cookies: { name: string; value: string }[]) {
    return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
        global: {
            fetch
        },
        cookies: {
            getAll() {
                return cookies;
            }
        }
    });
}

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
    depends("supabase:auth");

    const supabase = isBrowser()
        ? supabaseBrowser()
        : supabaseServer(data.cookies);

    const {
        data: { session }
    } = await supabase.auth.getSession();

    return { supabase, session };
};
