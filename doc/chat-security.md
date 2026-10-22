# Chat configuration and key rotation

Chat requests go from the browser to Fastify at `POST /api/chat`. Fastify calls
the configured provider. No provider credential belongs in a frontend variable.

## Local setup

Copy `backend/.env.example` to `backend/.env` and set:

```dotenv
CHAT_API_URL=https://api.anthropic.com/v1/chat/completions
CHAT_MODEL=your-provider-model
CHAT_API_KEY=your-new-provider-key
```

Run `npm run dev` from `backend/`; it loads that file. For a local runtime, use
its loopback HTTP endpoint and leave the key empty if it does not need one.
Remote endpoints require HTTPS and a key. The destination must not contain
credentials, query parameters or a fragment. It must support the OpenAI-style
chat completions format. Model identifiers come from the configured provider.

The frontend calls the relative `/api/chat` path. Vite proxies it locally, and
the existing deployment rewrites route it to the backend in production.

## Deploying the fix

1. Revoke the exposed provider key. Do not wait for evidence of misuse.
2. Generate a replacement and configure `CHAT_API_KEY`, `CHAT_API_URL` and
   `CHAT_MODEL` in the backend service environment. Do not paste the key into
   source code, issues or chat.
3. Remove the old `VITE_CHAT_API_KEY`, `VITE_CHAT_API_URL` and `VITE_CHAT_MODEL`
   settings from the frontend deployment environment and local frontend env files.
4. Deploy both services and rebuild the frontend. Updating environment variables
   alone does not change previously published JavaScript.
5. Check the new public JavaScript and browser requests: they must contain no
   provider credential, and chat must call only `/api/chat`.
6. Remove or restrict old deployments where possible. Old assets and cached copies
   can retain the revoked key; revocation is what makes those copies harmless.
7. Review provider usage and configure provider spending limits.

The code change does not rotate credentials or update deployment settings itself.

## Resource limits and access

The endpoint remains public. The mock user selector supplies a name for the reply;
it does not authenticate a caller. Login and password gates are outside this change.
CORS is not access control.

Each backend process allows 30 chat requests per minute and two concurrent provider
requests. Invalid requests consume the request quota too. The body limit is 256 KiB,
with at most 40 messages and 160,000 characters per message. Provider calls time out
after 30 seconds and request at most 2,048 output tokens. Cancelling a browser
request aborts the upstream fetch when the backend detects the disconnect; this
does not guarantee that the provider stops work or billing.

These in-memory counters reset on restart and are independent across replicas.
They do not provide a global budget or prevent unauthorized usage. A distributed
quota and real access control require a separate design before treating this as
a protected paid service. Provider errors are replaced with generic messages;
the backend does not forward provider headers or error bodies to the browser.
