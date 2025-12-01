# SPA_seg_spotifly
│
├── index.html      ← PÁG INICIAL PÚBLICA - botão "login viewer", "login manager", inicia OAuth PKCE
├── callback.html   ← PÁG p/ onde SPOTIFY redireciona - ler code da URL, ler state, valida PKCE, troca code pelo acess_token, redireciona usuário p/ dashboard
├── dashboard.html  ← tela (se o usuário tem só read → mostra Viewer, se tem modify → mostra Manager)
│
├── css/
│   └── styles.css ← chama a API do spotify (se o usuário tem só read → mostra Viewer, se tem modify → mostra Manager)
│
├── js/
│   ├── pkce.js      ←gera code_verifier, code_challenge, state
│   ├── auth.js      ←logica principal do fluxo Oauth (url de login, armazenar verifier + state, redirecionar para spotify)
│   ├── callback.js  ←Quando o usuário volta da autenticação (ler query params, validar state, fazer POST /api/token, salvar o token na memória / sessionStorage, redirecionar para dashboard)
│   ├── dashboard.js ←identificar os scopes concedidos, renderizar interface correta, conectar botões com Spotify API
│   └── spotify.js   ←getCurrentlyPlaying(), play(), pause(), nextTrack()
│
├── img/
│
├── env.js        ← será gerado pelo GitHub Actions (CLIENT_ID), workflow cria ele durante o deploy
│
└── .github/
    └── workflows/
        └── deploy.yml ← injeta CLIENT_ID, cria env.js, publica no GitHub Pages
