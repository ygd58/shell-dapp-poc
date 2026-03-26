import { useState } from 'react'
import { type WalletState, type DerivedAddress } from '../types'
// import { ethers } from 'ethers'

interface Props {
  wallet: WalletState
}

export default function SignStep({ wallet }: Props) {
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState<DerivedAddress | null>(null)
  const [signature, setSignature] = useState('')
  const [showQR, setShowQR] = useState(false)

  const buildSignRequest = () => {
    if (!message || !selected) return
    setShowQR(true)
  }

  const handleMockSign = () => {
    if (!selected || !message) return

    if (selected.type === 'ETH') {
      // EIP-191 personal_sign hash
// const msgHash = ethers.hashMessage(message)
      // Mock signature
      setSignature('0x' + 'a'.repeat(130))
    } else {
      // BIP-322 mock
      setSignature('Mock BIP-322 signature: ' + btoa(message))
    }
    setShowQR(false)
  }

  return (
    <div className="step">
      <h2>Step 3: Sign a Message</h2>

      <div className="form-group">
        <label>Message to sign</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message..."
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Select key</label>
        <select onChange={(e) => {
          const addr = wallet.addresses.find(a => a.path === e.target.value)
          setSelected(addr || null)
        }}>
          <option value="">-- Select a key --</option>
          {wallet.addresses.map(addr => (
            <option key={addr.path} value={addr.path}>
              {addr.type} — {addr.address.slice(0, 10)}...
            </option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button
          onClick={buildSignRequest}
          disabled={!message || !selected}
          className="btn-primary"
        >
          Generate QR for Shell
        </button>
        <button
          onClick={handleMockSign}
          disabled={!message || !selected}
          className="btn-secondary"
        >
          🧪 Mock Sign (Testing)
        </button>
      </div>

      {showQR && (
        <div className="qr-section">
          <h3>Scan with Shell:</h3>
          <div className="qr-placeholder">
            <p>📱 Animated QR Code would appear here</p>
            <p><small>ERC-4527 / UR format sign request</small></p>
            <p><small>Method: {selected?.type === 'ETH' ? 'EIP-191 personal_sign' : 'BIP-322'}</small></p>
          </div>
          <button onClick={() => setShowQR(false)} className="btn-secondary">
            📷 Scan Shell Response
          </button>
          <button onClick={handleMockSign} className="btn-primary">
            Use Mock Signature
          </button>
        </div>
      )}

      {signature && (
        <div className="result success">
          <h3>✅ Signature received!</h3>
          <code className="signature">{signature}</code>
          <button
            onClick={() => navigator.clipboard.writeText(signature)}
            className="btn-copy"
          >
            📋 Copy
          </button>
        </div>
      )}
    </div>
  )
}
