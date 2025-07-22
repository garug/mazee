export const responseStatus = <T>(status: number, data?: T) => {
    return Response.json(
        { ...data },
        {
            status,
        },
    );
};

export const responseError = <T>(message: string, status: number, data?: T) => {
    if (!String(status).startsWith("4")) {
        console.error({ error: message, status, data });
    }

    return Response.json(
        { error: message, ...data },
        {
            status,
        },
    );
};

export const notAuthenticated = responseError("User not authenticated", 401);
