# IntelliFAQ Frontend (Angular 19)

Ocean Professional themed Angular app for interacting with the AI FAQ ChatBot via REST and WebSocket.

## Quick Start

- Install deps: `npm ci`
- Start dev server: `npm start` (served at http://localhost:3000 by config)
- Build: `npm run build`

## Configuration (Environment)

Do not hardcode environment values. The app reads:
- NG_APP_API_BASE_URL (REST, default `/api`)
- NG_APP_WS_URL (WebSocket, default `ws://localhost:4000/ws`)

At runtime you can also inject:
```html
<script>
  window.__APP_ENV__ = {
    API_BASE_URL: "https://your-api.example.com",
    WS_URL: "wss://your-api.example.com/ws"
  };
</script>
```

## Backend Endpoints (assumed)
- REST:
  - GET /api/faqs
  - GET /api/faqs?q=term
  - GET /api/documents
  - GET /api/chat/history
  - POST /api/chat/query { prompt }
- WebSocket:
  - ws(s)://.../ws
  - Sends {type:'user_message', content:'...'}
  - Receives {type:'assistant_message', content:'...'}

## Structure

- src/app/components/chat: Chat UI (messages + input)
- src/app/components/faq-list: Searchable FAQ panel, emits questions
- src/app/components/doc-list: Document list panel
- src/app/services/api.service.ts: REST
- src/app/services/chat.service.ts: WebSocket stream
- src/app/config/env.ts: Environment resolver

## Style Guide

Ocean Professional theme: blue (#2563EB) & amber (#F59E0B), rounded corners, subtle gradients, minimalist, smooth transitions. See `src/styles.css`.

