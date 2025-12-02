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

//VIEWER: VER O QUE ESTÁ TOCANDO
const btnCurrent = document.getElementById('btn-current');
if (btnCurrent) {
    btnCurrent.onclick = async () => {
        const data = await apiGET('https://api.spotify.com/v1/me/player/currently-playing');
        document.getElementById('current-track').innerText = JSON.stringify(data, null, 2);
    };
}

//MANAGER: INFO DO PLAYER
const btnPlayerInfo = document.getElementById('btn-player-info');
if (btnPlayerInfo) {
    btnPlayerInfo.onclick = async () => {
        const data = await apiGET('https://api.spotify.com/v1/me/player');
        document.getElementById('player-info').innerText = JSON.stringify(data, null, 2);
    };
}

//MANAGER: PLAY — TOCAR PLAYLIST ESPECÍFICA
//PLAYLIST: 0ySW98M0TE2j64CdoULwqT

const PLAYLIST_URI = "spotify:playlist:0ySW98M0TE2j64CdoULwqT";

const btnPlay = document.getElementById('btn-play');
if (btnPlay) {
    btnPlay.onclick = () => apiPUT(
        'https://api.spotify.com/v1/me/player/play',
        {
            context_uri: PLAYLIST_URI,
            offset: { position: 0 }, // começa pela primeira música
            position_ms: 0
        }
    );
}

//MANAGER: PAUSE
const btnPause = document.getElementById('btn-pause');
if (btnPause) {
    btnPause.onclick = () => apiPUT('https://api.spotify.com/v1/me/player/pause');
}

//MANAGER: NEXT

const btnNext = document.getElementById('btn-next');
if (btnNext) {
    btnNext.onclick = () => apiPOST('https://api.spotify.com/v1/me/player/next');
}
