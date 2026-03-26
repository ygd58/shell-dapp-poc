import { useState } from 'react'
import { AnimatedQRScanner } from '@keystonehq/animated-qr'
import { CryptoAccount, CryptoHDKey } from '@keystonehq/bc-ur-registry'
import { generateAddressFromXpub } from '@keystonehq/bc-ur-registry-eth'
import { deriveBtcAddress } from '../utils/btcDerivation'
import { type WalletState, type DerivedAddress } from '../types'

interface Props {
  onConnected: (wallet: WalletState) => void
}

const MOCK_WALLET: WalletState = {
  masterFingerprint: 'abcd1234',
  addresses: [
    { path: "m/44'/60'/0'/0/0", type: 'ETH', address: '0x742d35Cc6634C0532925a3b8D4C9b6e1d2F8bA93', publicKey: '02a1b2c3' },
    { path: "m/44'/0'/0'/0/0", type: 'BTC-Legacy', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', publicKey: '03b2c3d4' },
    { path: "m/49'/0'/0'/0/0", type: 'BTC-NestedSegWit', address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', publicKey: '04c3d4e5' },
    { path: "m/84'/0'/0'/0/0", type: 'BTC-NativeSegWit', address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', publicKey: '05d4e5f6' },
  ],
}

function parseURToWallet(ur: { type: string; cbor: string }): WalletState {
  const cbor = Buffer.from(ur.cbor, 'hex')
  const addresses: DerivedAddress[] = []
  let masterFingerprint = 'unknown'

  if (ur.type === 'crypto-account') {
    const account = CryptoAccount.fromCBOR(cbor)
    masterFingerprint = account.getMasterFingerprint().toString('hex')

    for (const descriptor of account.getOutputDescriptors()) {
      const hdKey = descriptor.getCryptoKey() as CryptoHDKey
      const origin = hdKey.getOrigin()
      const path = origin ? 'm/' + origin.getPath() : ''
      const xpub = hdKey.getBip32Key()
      const pubkey = hdKey.getKey().toString('hex')

      if (path.startsWith("44'/60'")) {
        const address = generateAddressFromXpub(xpub, '0')
        addresses.push({ path, type: 'ETH', address, publicKey: pubkey })
      } else if (path.startsWith("44'/0'")) {
        addresses.push({ path, type: 'BTC-Legacy', address: deriveBtcAddress(xpub, 'legacy'), publicKey: pubkey })
      } else if (path.startsWith("49'/0'")) {
        addresses.push({ path, type: 'BTC-NestedSegWit', address: deriveBtcAddress(xpub, 'nested-segwit'), publicKey: pubkey })
      } else if (path.startsWith("84'/0'")) {
        addresses.push({ path, type: 'BTC-NativeSegWit', address: deriveBtcAddress(xpub, 'native-segwit'), publicKey: pubkey })
      }
    }
  } else if (ur.type === 'crypto-hdkey') {
    const hdKey = CryptoHDKey.fromCBOR(cbor)
    const origin = hdKey.getOrigin()
    const path = origin ? 'm/' + origin.getPath() : ''
    const xpub = hdKey.getBip32Key()
    masterFingerprint = origin?.getSourceFingerprint()?.toString('hex') || 'unknown'
    const address = generateAddressFromXpub(xpub, '0')
    addresses.push({ path, type: 'ETH', address, publicKey: Buffer.from(hdKey.getKey()).toString('hex') })
  }

  return { masterFingerprint, addresses }
}

export default function ConnectStep({ onConnected }: Props) {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')

  const handleScan = (ur: { type: string; cbor: string }) => {
    try {
      setScanning(false)
      const wallet = parseURToWallet(ur)
      onConnected(wallet)
    } catch (e) {
      setError(`QR parse error: ${e}`)
    }
  }

  return (
    <div className="step">
      <h2>Step 1: Connect Shell Wallet</h2>
      <p>On your Shell device, go to <strong>Watch-only Wallet → Connect</strong> and show the QR code.</p>

      <div className="button-group">
        <button onClick={() => { setScanning(true); setError('') }} className="btn-primary">
          📷 Scan Shell QR Code
        </button>
        <button onClick={() => onConnected(MOCK_WALLET)} className="btn-secondary">
          🧪 Use Mock Wallet (Testing)
        </button>
      </div>

      {scanning && (
        <div className="scanner-container">
          <h3>Point camera at Shell QR code:</h3>
          <AnimatedQRScanner
            handleScan={handleScan}
            handleError={(e: string) => { setError(e); setScanning(false) }}
            urTypes={['crypto-account', 'crypto-hdkey']}
          />
          <button onClick={() => setScanning(false)} className="btn-secondary" style={{marginTop: '1rem'}}>
            Cancel
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      <div className="info-box">
        <h3>How it works</h3>
        <p>Shell uses <strong>ERC-4527</strong> (UR format) animated QR codes. 100% airgapped.</p>
      </div>
    </div>
  )
}
