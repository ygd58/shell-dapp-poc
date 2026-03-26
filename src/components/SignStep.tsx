import { useState } from 'react'
import { AnimatedQRCode, AnimatedQRScanner } from '@keystonehq/animated-qr'
import { type WalletState, type DerivedAddress } from '../types'

interface Props {
  wallet: WalletState
}

// Build a simple UR encoded sign request
// Full implementation would use @keystonehq/bc-ur-registry-eth EthSignRequest
function buildURSignRequest(message: string, address: string, type: string): { type: string; cbor: string } {
  // Encode as a basic UR bytes payload for demo
  // Real implementation uses ETH-SIGN-REQUEST or BTC-SIGN-REQUEST UR types
  const payload = JSON.stringify({ message, address, sigType: type })
  const hex = Array.from(new TextEncoder().encode(payload))
    .map(b => b.toString(16).padStart(2, '0')).join('')
  return {
    type: type === 'ETH' ? 'eth-sign-request' : 'btc-sign-request',
    cbor: hex,
  }
}

export default function SignStep({ wallet }: Props) {
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState<DerivedAddress | null>(null)
  const [signature, setSignature] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [scanningResponse, setScanningResponse] = useState(false)
  const [urData, setUrData] = useState<{ type: string; cbor: string } | null>(null)

  const buildSignRequest = () => {
    if (!message || !selected) return
    const ur = buildURSignRequest(message, selected.address, selected.type)
    setUrData(ur)
    setShowQR(true)
  }

  const handleSignatureScan = (ur: { type: string; cbor: string }) => {
    setScanningResponse(false)
    // Parse signature from Shell response
    try {
      const bytes = Uint8Array.from(ur.cbor.match(/.{1,2}/g)!.map(b => parseInt(b, 16)))
      const text = new TextDecoder().decode(bytes)
      setSignature(text || '0x' + ur.cbor)
    } catch {
      setSignature('0x' + ur.cbor)
    }
    setShowQR(false)
  }

  const handleMockSign = () => {
    if (!selected || !message) return
    if (selected.type === 'ETH') {
      setSignature('0x' + 'a'.repeat(130))
    } else {
      setSignature('Mock BIP-322 signature: ' + btoa(message))
    }
    setShowQR(false)
  }

  return (
    <div className="step">
      <h2>Step 3: Sign a Message</h2>

      <div className="form-group">
        <label>Message to sign</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter your message..." rows={4} />
      </div>

      <div className="form-group">
        <label>Select key</label>
        <select onChange={e => {
          const addr = wallet.addresses.find(a => a.path === e.target.value)
          setSelected(addr || null)
        }}>
          <option value="">-- Select a key --</option>
          {wallet.addresses.map(addr => (
            <option key={addr.path} value={addr.path}>
              {addr.type} — {addr.address.slice(0, 12)}...
            </option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button onClick={buildSignRequest} disabled={!message || !selected} className="btn-primary">
          📱 Generate QR for Shell
        </button>
        <button onClick={handleMockSign} disabled={!message || !selected} className="btn-secondary">
          🧪 Mock Sign (Testing)
        </button>
      </div>

      {showQR && urData && (
        <div className="qr-section">
          <h3>Scan with Shell device:</h3>
          <p><small>Method: {selected?.type === 'ETH' ? 'EIP-191 personal_sign' : 'BIP-322'}</small></p>
          <AnimatedQRCode
            type={urData.type}
            cbor={urData.cbor}
            options={{ size: 280, interval: 200 }}
          />
          <div className="button-group" style={{marginTop: '1rem'}}>
            <button onClick={() => setScanningResponse(true)} className="btn-primary">
              📷 Scan Shell Signature Response
            </button>
            <button onClick={handleMockSign} className="btn-secondary">
              Use Mock Signature
            </button>
          </div>
        </div>
      )}

      {scanningResponse && (
        <div className="scanner-container">
          <h3>Scan Shell signature QR:</h3>
          <AnimatedQRScanner
            handleScan={handleSignatureScan}
            handleError={(e: string) => { setScanningResponse(false); console.error(e) }}
            urTypes={['eth-signature', 'btc-signature']}
          />
          <button onClick={() => setScanningResponse(false)} className="btn-secondary" style={{marginTop: '1rem'}}>
            Cancel
          </button>
        </div>
      )}

      {signature && (
        <div className="result success">
          <h3>✅ Signature received!</h3>
          <code className="signature">{signature}</code>
          <button onClick={() => navigator.clipboard.writeText(signature)} className="btn-copy">📋 Copy</button>
        </div>
      )}
    </div>
  )
}
