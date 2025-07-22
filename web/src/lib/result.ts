export function ok(): Result<undefined>;
export function ok<T>(data: T): Result<T>;
export function ok<T>(data?: T): Result<T> {
    return {
        data: data as T,
        error: undefined as never,
    };
}

export function err(error: any): Result<never> {
    return {
        data: undefined as never,
        error,
    };
}
