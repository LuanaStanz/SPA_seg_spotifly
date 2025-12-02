// Gera string aleatória criptograficamente segura
export function generateRandomString(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// Faz SHA-256
export async function sha256(plain) {
    const enc = new TextEncoder();
    const data = enc.encode(plain);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(hash);
}

// Converte hash para Base64URL
function base64UrlEncode(bytes) {
    let str = '';
    const bytesArr = new Uint8Array(bytes);
    bytesArr.forEach(b => str += String.fromCharCode(b));
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}