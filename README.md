# Accept USDT Payments with XPayr

[![CI](https://github.com/xpayrcom/accept-usdt-payments-example/actions/workflows/ci.yml/badge.svg)](https://github.com/xpayrcom/accept-usdt-payments-example/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e.svg)](LICENSE)

Runnable server-side example for creating USDT checkout sessions with XPayr while keeping merchant API keys out of the browser.

> **Status:** Runnable test-key-first example

## Purpose

Show the shortest secure path from a product page to an XPayr-hosted USDT checkout.

## Included

- Dependency-free Node.js server
- Server-side payment-session creation
- Responsive checkout launcher with no client-side secret

## Requirements

- Node.js 18+
- npm 9+

## Quick start

```bash
cp .env.example .env
npm test
npm start
```

Open `http://127.0.0.1:3000`. The example defaults to a test credential placeholder and will not create a session until you provide your own XPayr key.

`XPAYR_NETWORK` selects the USDT rail enabled for your merchant account. Confirm the exact network key in `GET /me/networks`; the sample value is not a recommendation to use mainnet during development.

## Request flow

1. The browser calls this example server.
2. The server creates an XPayr payment session using its private API key.
3. The browser receives only the payment ID, hosted checkout URL, and initial status.
4. Your backend fulfills the order only after a verified webhook or API reconciliation confirms completion.

Use an XPayr test key before live credentials. Never expose `sk_test_*`, `sk_live_*`, agent keys, webhook secrets, or wallet private keys in browser code or commits.

## Documentation

- [Developer Hub](https://xpayr.com/developers)
- [Merchant API documentation](https://xpayr.com/doc-api)
- [Testnet checkout guide](https://xpayr.com/developers/testnet-checkout-api)
- [Webhook signature guide](https://xpayr.com/developers/webhook-signature-guide)

## Security

Read [SECURITY.md](SECURITY.md) before reporting a vulnerability. Payment completion must be based on verified XPayr webhook/API state and canonical on-chain evidence, not browser callbacks alone.

## License

MIT. See [LICENSE](LICENSE).
