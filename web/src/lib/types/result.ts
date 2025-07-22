type ResultData<T> = {
    data: T,
    error: never
}

type ResultError = {
    error: any;
    data: never;
}

type Result<T = any> = ResultData<T> | ResultError;
