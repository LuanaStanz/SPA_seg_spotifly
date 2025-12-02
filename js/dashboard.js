import { apiGET, apiPUT, apiPOST } from './spotify.js';

const scope = sessionStorage.getItem('granted_scope');

if (!scope) {
    window.location = 'index.html';
}

document.getElementById('profile').innerText = `Escopos concedidos: ${scope}`;

if (scope.includes('user-read-playback-state')) {
    document.getElementById('viewer-controls').style.display = 'block';
}

if (scope.includes('user-modify-playback-state')) {
    document.getElementById('manager-controls').style.display = 'block';
}

// Viewer action
const btnCurrent = document.getElementById('btn-current');
if (btnCurrent) btnCurrent.onclick = async () => {
    const data = await apiGET('https://api.spotify.com/v1/me/player/currently-playing');
    document.getElementById('current-track').innerText = JSON.stringify(data, null, 2);
};

// Manager actions
const btnPlayerInfo = document.getElementById('btn-player-info');
if (btnPlayerInfo) btnPlayerInfo.onclick = async () => {
    const data = await apiGET('https://api.spotify.com/v1/me/player');
    document.getElementById('player-info').innerText = JSON.stringify(data, null, 2);
};

const btnPlay = document.getElementById('btn-play');
if (btnPlay) btnPlay.onclick = () => apiPUT('https://api.spotify.com/v1/me/player/play');

const btnPause = document.getElementById('btn-pause');
if (btnPause) btnPause.onclick = () => apiPUT('https://api.spotify.com/v1/me/player/pause');

const btnNext = document.getElementById('btn-next');
if (btnNext) btnNext.onclick = () => apiPOST('https://api.spotify.com/v1/me/player/next');
