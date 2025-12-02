import { apiGET, apiPUT, apiPOST } from './spotify.js';

//0ySW98M0TE2j64CdoULwqT
const scope = sessionStorage.getItem('granted_scope');

if (!scope) {
    window.location = 'index.html';
}

document.getElementById('profile').innerText = `Escopos concedidos: ${scope}`;

//exibir controles de acordo com escopo
if (scope.includes('user-read-playback-state')) {
    document.getElementById('viewer-controls').style.display = 'block';
}
if (scope.includes('user-modify-playback-state')) {
    document.getElementById('manager-controls').style.display = 'block';
}

// Função auxiliar para imprimir erros detalhados
async function handleApiError(response, endpoint) {
    let msg = `⚠️ ERRO ao chamar ${endpoint}\n\n`;

    msg += `Status: ${response.status}\n`;

    try {
        const json = await response.json();
        msg += `Mensagem do Spotify: ${JSON.stringify(json, null, 2)}\n`;
    } catch {
        msg += "Nenhum JSON retornado.\n";
    }

    if (response.status === 401) {
        msg += "\n PS: response.status === 401. \nO token pode ter expirado. Tente fazer login novamente.";
    }

    if (response.status === 403) {
        msg += "\n response.status === 403 \nPS: talvez você não tem o escopo necessário.";
    }

    if (response.status === 404) {
        msg += "\n response.status === 403 \nNenhum dispositivo ativo detectado.";
    }

    alert(msg);
}

//VIEWER: VER O QUE ESTÁ TOCANDO
const btnCurrent = document.getElementById('btn-current');
if (btnCurrent) {
    btnCurrent.onclick = async () => {
        const endpoint = 'GET currently-playing';

        const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` }
        });

        if (!res.ok) return handleApiError(res, endpoint);

        const data = await res.json();
        document.getElementById('current-track').innerText = JSON.stringify(data, null, 2);
    };
}

//MANAGER: INFO DO PLAYER
const btnPlayerInfo = document.getElementById('btn-player-info');
if (btnPlayerInfo) {
    btnPlayerInfo.onclick = async () => {
        const endpoint = 'GET player-info';

        const res = await fetch('https://api.spotify.com/v1/me/player', {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` }
        });

        if (!res.ok) return handleApiError(res, endpoint);

        const data = await res.json();
        document.getElementById('player-info').innerText = JSON.stringify(data, null, 2);
    };
}

//MANAGER: PLAY — TOCAR PLAYLIST ESPECÍFICA
const PLAYLIST_URI = "spotify:playlist:0ySW98M0TE2j64CdoULwqT";

const btnPlay = document.getElementById('btn-play');
if (btnPlay) {
    btnPlay.onclick = async () => {
        const endpoint = 'PUT play (playlist específica)';

        const res = await fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                context_uri: PLAYLIST_URI,
                offset: { position: 0 },
                position_ms: 0
            })
        });

        if (!res.ok) return handleApiError(res, endpoint);

        alert("Playlist iniciada com sucesso!");
    };
}

//MANAGER: PAUSE
const btnPause = document.getElementById('btn-pause');
if (btnPause) {
    btnPause.onclick = async () => {
        const endpoint = 'PUT pause';

        const res = await fetch('https://api.spotify.com/v1/me/player/pause', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` }
        });

        if (!res.ok) return handleApiError(res, endpoint);

        alert("Música pausada.");
    };
}

//MANAGER: NEXT
const btnNext = document.getElementById('btn-next');
if (btnNext) {
    btnNext.onclick = async () => {
        const endpoint = 'POST next';

        const res = await fetch('https://api.spotify.com/v1/me/player/next', {
            method: 'POST',
            headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` }
        });

        if (!res.ok) return handleApiError(res, endpoint);

        alert("Próxima música!");
    };
}
