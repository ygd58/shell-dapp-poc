import * as bitcoin from 'bitcoinjs-lib'
import { HDKey } from '@scure/bip32'

export function deriveBtcAddress(xpub: string, type: 'legacy' | 'nested-segwit' | 'native-segwit'): string {
  try {
    const node = HDKey.fromExtendedKey(xpub)
    const child = node.deriveChild(0).deriveChild(0)
    if (!child.publicKey) return 'unknown'
    const pubkey = Buffer.from(child.publicKey)

    switch (type) {
      case 'legacy': {
        const p2pkh = bitcoin.payments.p2pkh({ pubkey })
        return p2pkh.address || 'unknown'
      }
      case 'nested-segwit': {
        const p2wpkh = bitcoin.payments.p2wpkh({ pubkey })
        const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh })
        return p2sh.address || 'unknown'
      }
      case 'native-segwit': {
        const p2wpkh = bitcoin.payments.p2wpkh({ pubkey })
        return p2wpkh.address || 'unknown'
      }
    }
  } catch (e) {
    console.error('BTC address derivation error:', e)
    return 'derivation-error'
  }
}
