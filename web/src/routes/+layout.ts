import { getDomain } from "tldts";
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { LayoutLoad } from "./$types";
import {
    createBrowserClient,
    createServerClient,
    isBrowser,
} from "@supabase/ssr";

function supabaseBrowser() {
    return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
        global: {
            fetch,
        },
    });
}

function supabaseServer(cookies: { name: string; value: string }[], url: URL) {
    const domain = getDomain(url.href);

    if (!domain) console.warn(`Could not find domain: ${domain}`);

    return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
        global: {
            fetch,
        },
        cookies: {
            getAll() {
                return cookies;
            },
        },
        cookieOptions: {
            name: "supabase-session",
            domain: domain || url.hostname,
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        },
    });
}

export const load: LayoutLoad = async ({ url, data, depends }) => {
    depends("supabase:auth");

    const supabase = isBrowser()
        ? supabaseBrowser()
        : supabaseServer(data.cookies, url);

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return { supabase, session };
};
