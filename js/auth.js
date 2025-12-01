import { generateRandomString, sha256 } from './pkce.js';


const redirectUri = window.location.origin + window.location.pathname.replace('index.html','') + 'callback.html';


function startLogin(scope) {
    const state = generateRandomString(16);
    const codeVerifier = generateRandomString(64);


    sessionStorage.setItem('pkce_state', state);
    sessionStorage.setItem('pkce_verifier', codeVerifier);
    sessionStorage.setItem('req_scope', scope);


    sha256(codeVerifier).then(codeChallenge => {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: window.CLIENT_ID,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
            scope: scope,
            state: state
        });
        window.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
    });
}


document.getElementById('login-viewer').onclick = () => { startLogin('user-read-playback-state');};

document.getElementById('login-manager').onclick = () => { startLogin('user-read-playback-state user-modify-playback-state');};