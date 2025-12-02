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

//imprimir erros detalhados
async function handleApiError(response, endpoint) {
    let msg = `ERRO ao chamar ${endpoint}\n\n`;

    msg += `Status: ${response.status}\n`;

    try {
        const json = await response.json();
        msg += `Mensagem do Spotify: ${JSON.stringify(json, null, 2)}\n`;
    } catch {
        msg += "Nenhum JSON retornado.\n";
    }

    if (response.status === 401) {
        msg += "\n PS: 401 - Unauthorized. Você não enviou um token válido ou o token expirou.";
    }

    if (response.status === 403) {
        msg += "\n PS: 403 Forbidden - talvez você não tem o escopo necessário.";
    }

    if (response.status === 404) {
        msg += "\n 403 - Nenhum dispositivo ativo detectado.";
    }

    alert(msg);
}
//filtrar resposta gigante em json
function formatCurrentlyPlaying(data) {
    if (!data || !data.item) {
        return "Nada está tocando agora.";
    }

    const track = data.item;

    return `
**Música atual**
- **Nome:** ${track.name}
- **Artista:** ${track.artists?.map(a => a.name).join(', ') || "Desconhecido"}
- **Álbum:** ${track.album?.name || "Desconhecido"}
- **Duração:** ${(track.duration_ms / 1000 / 60).toFixed(2)} min
- **Preview:** ${track.preview_url || "Indisponível"}

**Progresso**
- ${Math.floor(data.progress_ms / 1000)}s de ${Math.floor(track.duration_ms / 1000)}s

**Tocando:** ${data.is_playing ? "Sim" : "Não"}
`.trim();
}
function formatPlayerInfo(data) {
    if (!data || !data.device) {
        return "Nenhum player ativo encontrado.";
    }

    return `
**Dispositivo**
- **Nome:** ${data.device.name}
- **Tipo:** ${data.device.type}
- **Volume:** ${data.device.volume_percent}%
- **Ativo:** ${data.device.is_active ? "Sim" : "Não"}

**Status**
- **Tocando:** ${data.is_playing ? "Sim" : "Não"}
- **Shuffle:** ${data.shuffle_state ? "Ligado" : "Desligado"}
- **Repeat:** ${data.repeat_state}

**Contexto**
- ${data.context?.type || "Nenhum"}
- ${data.context?.external_urls?.spotify || ""}
`.trim();
}

// ---------- BOTÕES ---------- //
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

        document.getElementById('current-track').innerText =
            formatCurrentlyPlaying(data);
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

        document.getElementById('player-info').innerText =
            formatPlayerInfo(data);
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
