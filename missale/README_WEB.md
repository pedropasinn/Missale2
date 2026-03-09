# Missal (Web) – Fase 1

Esta pasta `www/` é o *mesmo* conteúdo usado no app Cordova, mas preparado para rodar bem em navegador (servido por HTTP/HTTPS).

## Rodar localmente (recomendado)

### Opção A (sem Node): Python

Dentro da pasta `www/`:

```bash
python3 -m http.server 5173
```

Depois abra no navegador:

- `http://localhost:5173/`

### Opção B (com Node): http-server via npx

Dentro da pasta `www/`:

```bash
npm run dev
```

Depois abra:

- `http://localhost:5173/`

## Por que precisa de servidor?

O app carrega vários trechos HTML via AJAX. Em `file://` isso costuma falhar por bloqueios do navegador.

## Deploy

Você pode publicar a pasta `www/` em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, servidor próprio). O `index.html` já redireciona para `misal_v2/feria_actual.html`.

## Nota sobre Cordova

No navegador não existe `navigator.app.exitApp()` nem `plugins.insomnia`. Para não quebrar o legado, adicionamos um *shim* leve no começo de:

- `misal_v2/mis_funciones_devoc.js`
- `misal_v2/mis_funciones_misal.js`

Ele cria stubs quando Cordova não está presente e também dispara um evento `deviceready` no navegador.
