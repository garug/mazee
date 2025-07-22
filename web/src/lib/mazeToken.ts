import crypto from 'crypto'
import {SUPABASE_KEY} from "$env/static/private";
import { ok } from "$lib/result";

const SECRET = SUPABASE_KEY;

function generateSignature(data: string) {
    return crypto
        .createHmac('sha256', SECRET)
        .update(data)
        .digest('hex');
}

export function sign<T>(data: T): Result<string> {
    const payload = JSON.stringify(data);
    const signature = generateSignature(payload);

    return ok(`${Buffer.from(payload).toString('base64')}.${signature}`);
}

export function verify(token: string): Result<Record<string, any> | null> {
    try {
        const [encoded, signature] = token.split('.');
        if (!encoded || !signature) return ok(null);

        const payloadStr = Buffer.from(encoded, 'base64').toString();
        const expectedSignature = generateSignature(payloadStr);

        if (signature !== expectedSignature) return ok(null);

        return ok(JSON.parse(payloadStr));
    } catch (e) {
        console.error(e);
        return ok(null);
    }
}

