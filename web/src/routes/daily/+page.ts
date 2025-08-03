import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch("/api/maze");

    const { token, error: e, ...rest } = await response.json();

    console.log({token, e, rest})

    if (e) {
        error(response.status, e);
    }

    return {
        token
    };
};
