import { useState } from 'react'
import { type WalletState } from '../types'

interface Props {
  onConnected: (wallet: WalletState) => void
}

// Mock QR data for testing without real Shell hardware
const MOCK_WALLET: WalletState = {
  masterFingerprint: 'abcd1234',
  addresses: [
    {
      path: "m/44'/60'/0'/0/0",
      type: 'ETH',
      address: '0x742d35Cc6634C0532925a3b8D4C9b6e1d2F8bA93',
      publicKey: '02a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    },
    {
      path: "m/44'/0'/0'/0/0",
      type: 'BTC-Legacy',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf Na',
      publicKey: '03b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    },
    {
      path: "m/49'/0'/0'/0/0",
      type: 'BTC-NestedSegWit',
      address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
      publicKey: '04c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    },
    {
      path: "m/84'/0'/0'/0/0",
      type: 'BTC-NativeSegWit',
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      publicKey: '05d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    },
  ],
}

export default function ConnectStep({ onConnected }: Props) {
  const [scanning, setScanning] = useState(false)
  // const [error, setError] = useState('')

  const handleMockConnect = () => {
    onConnected(MOCK_WALLET)
  }

  return (
    <div className="step">
      <h2>Step 1: Connect Shell Wallet</h2>
      <p>
        On your Shell device, go to <strong>Watch-only Wallet → Connect</strong> and
        scan the QR code it presents.
      </p>

      <div className="button-group">
        <button onClick={() => setScanning(true)} className="btn-primary">
          📷 Scan Shell QR Code
        </button>
        <button onClick={handleMockConnect} className="btn-secondary">
          🧪 Use Mock Wallet (Testing)
        </button>
      </div>

      {scanning && (
        <div className="scanner-placeholder">
          <p>📷 QR Scanner would appear here</p>
          <p><small>Requires @keystonehq/animated-qr scanner component</small></p>
          <button onClick={() => setScanning(false)}>Cancel</button>
          <button onClick={handleMockConnect} className="btn-primary">
            Use Mock Data Instead
          </button>
        </div>
      )}

      

      <div className="info-box">
        <h3>How it works</h3>
        <p>
          Shell uses <strong>ERC-4527</strong> (UR format) QR codes for airgapped
          communication. No USB, Bluetooth, or internet required.
        </p>
      </div>
    </div>
  )
}
