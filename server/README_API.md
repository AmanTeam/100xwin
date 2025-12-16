# Backend API (demo)

Base URL: `http://localhost:5174/api`

## Health
- `GET /health`

## Auth
- `POST /auth/register` `{ email, password }`
- `POST /auth/login` `{ email, password }`

## Wallet (requires Authorization: Bearer <token>)
- `GET /wallet`
- `POST /wallet/credit` `{ amount, note? }`
- `POST /wallet/debit` `{ amount, note? }`
- `GET /transactions`

## Game (provably fair, demo)
- `GET /game/current-round`
- `POST /game/place-bet` (auth) `{ bet_type, stake, multiplier }`
- `POST /game/settle-round` `{ client_seed }`

Notes:
- Round uses committed `server_seed_hash` while open.
- On settlement, server reveals `server_seed` + result is derived from `sha256(server_seed:client_seed:round_id)`.
- Payouts are pool-based (Dream11-like): `prize_pool = total_bets - fee` split across winners proportionally.
