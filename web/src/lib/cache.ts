import {Redis} from '@upstash/redis'
import {UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN} from "$env/static/private";

const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
})

export async function set<T>(key: string, value: T) {
    return redis.set(key, value, {
        ex: 60 * 60 * 24, // 1 day expiration
    });
}

export async function get<T>(key: string): Promise<T | null> {
    return redis.get(key);
}
