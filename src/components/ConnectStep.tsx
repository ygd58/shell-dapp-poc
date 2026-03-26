import { useState } from 'react'
import { AnimatedQRScanner } from '@keystonehq/animated-qr'
import { type WalletState } from '../types'

interface Props {
  onConnected: (wallet: WalletState) => void
}

const MOCK_WALLET: WalletState = {
  masterFingerprint: 'abcd1234',
  addresses: [
    { path: "m/44'/60'/0'/0/0", type: 'ETH', address: '0x742d35Cc6634C0532925a3b8D4C9b6e1d2F8bA93', publicKey: '02a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2' },
    { path: "m/44'/0'/0'/0/0", type: 'BTC-Legacy', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', publicKey: '03b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3' },
    { path: "m/49'/0'/0'/0/0", type: 'BTC-NestedSegWit', address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', publicKey: '04c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4' },
    { path: "m/84'/0'/0'/0/0", type: 'BTC-NativeSegWit', address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', publicKey: '05d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5' },
  ],
}

export default function ConnectStep({ onConnected }: Props) {
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')

  const handleScan = (ur: { type: string; cbor: string }) => {
    try {
      setScanning(false)
      // Parse crypto-account UR from Shell
      // The UR type from Shell is 'crypto-account'
      if (ur.type === 'crypto-account' || ur.type === 'crypto-hdkey') {
        // For now parse basic info from the UR
        // Full implementation would use @keystonehq/bc-ur-registry-eth
        const wallet: WalletState = {
          masterFingerprint: ur.cbor.slice(0, 8),
          addresses: [
            { path: "m/44'/60'/0'/0/0", type: 'ETH', address: 'Derived from QR', publicKey: ur.cbor.slice(0, 66) },
            { path: "m/44'/0'/0'/0/0", type: 'BTC-Legacy', address: 'Derived from QR', publicKey: ur.cbor.slice(0, 66) },
            { path: "m/49'/0'/0'/0/0", type: 'BTC-NestedSegWit', address: 'Derived from QR', publicKey: ur.cbor.slice(0, 66) },
            { path: "m/84'/0'/0'/0/0", type: 'BTC-NativeSegWit', address: 'Derived from QR', publicKey: ur.cbor.slice(0, 66) },
          ],
        }
        onConnected(wallet)
      } else {
        setError(`Unexpected QR type: ${ur.type}. Expected crypto-account from Shell.`)
      }
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
        <p>Shell uses <strong>ERC-4527</strong> (UR format) animated QR codes. 100% airgapped — no USB, Bluetooth, or internet.</p>
      </div>
    </div>
  )
}
