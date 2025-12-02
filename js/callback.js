import { generateRandomString } from './pkce.js';


const params = new URLSearchParams(window.location.search);
const code = params.get('code');
const state = params.get('state');


const savedState = sessionStorage.getItem('pkce_state');
const codeVerifier = sessionStorage.getItem('pkce_verifier');
const redirectUri = window.location.origin + window.location.pathname.replace('callback.html','') + 'callback.html';

if (!code) {
    alert("Erro: nenhum 'code' recebido do Spotify.");
    throw new Error("Missing authorization code.");
}

if (state !== savedState) {
    alert('ERRO: STATE inválido. Possível ataque CSRF.');
    throw new Error('State mismatch');
}

async function exchangeToken() {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: window.CLIENT_ID,
        code_verifier: codeVerifier
    });


    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });


    const data = await res.json();
    sessionStorage.setItem('access_token', data.access_token);
    sessionStorage.setItem('granted_scope', data.scope);

    window.location = 'dashboard.html';
}


exchangeToken();