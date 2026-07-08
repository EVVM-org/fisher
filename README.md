# EVVM Fisher

A [Nitro v3](https://nitro.build) server that acts as an **EVVM fisher** — receives signed actions (built with [`@evvm/evvm-js`](https://evvm.info/docs/npm-libraries/evvm-js)), signs them with the fisher's private key, and executes them on-chain. Fishers are the execution layer that enables gasless transactions for EVVM users. [Learn more about EVVM](https://evvm.info).

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NITRO_FISHER_PRIVATE_KEY` | Yes | — | EVM private key of the fisher signer |
| `NITRO_RPC_URL` | No | Sepolia public RPC | JSON-RPC endpoint |
| `PORT` | No | `3000` (`80` in Docker) | HTTP server port |

## Getting Started

```bash
npm install
cp .env.example .env   # edit with your fisher private key
npm run dev
```

## Building a SignedAction

Use [`@evvm/evvm-js`](https://evvm.info/docs/npm-libraries/evvm-js) to build a `SignedAction` and send it to `POST /execute`:

```ts
import { Core } from "@evvm/evvm-js";

const signedAction = await core.pay({
  toAddress, tokenAddress, amount,
  priorityFee, nonce, isAsyncExec,
});

await fetch("https://your-fisher/execute", {
  method: "POST",
  body: JSON.stringify({ signedAction }),
});
```

## API

### `POST /execute`

**Request:** `{ signedAction: ISerializableSignedAction, gas?: number }`

**Response:** `{ success: true, data: { txHash } }` or `{ success: false, message }`

## Docker

```bash
# Build
docker build -t evvm-fisher .

# Run with inline env vars
docker run -d -p 3000:80 \
  -e NITRO_FISHER_PRIVATE_KEY=0xYourPrivateKeyHere \
  evvm-fisher

# Or using a .env file
docker run -d -p 3000:80 --env-file .env evvm-fisher
```

## Deploying

```bash
npm run build
```

See the [Nitro deployment docs](https://nitro.build/deploy) for available presets.
