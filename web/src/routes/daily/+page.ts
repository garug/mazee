import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch("/api/maze");

    const { token, error: e } = await response.json();

    if (e) {
        error(response.status, e);
    }

    return {
        token
    };
};
