import crypto from 'node:crypto'

export const sha256Hex = (input) => crypto.createHash('sha256').update(String(input)).digest('hex')

export const randomHex = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

export const uuid = () => crypto.randomUUID()
