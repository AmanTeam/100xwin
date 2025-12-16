import { sha256Hex } from '../utils/crypto.js'

const bytesFromHex = (hex) => {
  const normalized = String(hex || '').toLowerCase().replace(/^0x/, '')
  const out = Buffer.alloc(Math.floor(normalized.length / 2))
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

export const deriveRoundResult = ({ serverSeed, clientSeed, nonce }) => {
  const digestHex = sha256Hex(`${serverSeed}:${clientSeed}:${nonce}`)
  const bytes = bytesFromHex(digestHex)

  const colors = ['Green', 'Violet', 'Red']
  const numbers = Array.from({ length: 10 }, (_, i) => i)
  const bigSmall = ['Big', 'Small']

  const colorIndex = bytes[0] % colors.length
  const numberIndex = bytes[1] % numbers.length
  const bigSmallIndex = bytes[2] % bigSmall.length

  return {
    nonce,
    color: colors[colorIndex],
    number: numbers[numberIndex],
    bigSmall: bigSmall[bigSmallIndex],
    digest: digestHex,
  }
}
