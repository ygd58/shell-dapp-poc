import { type WalletState } from '../types'

interface Props {
  wallet: WalletState
  onContinue: () => void
}

const TYPE_LABELS: Record<string, string> = {
  'ETH': '🔷 Ethereum (BIP-44)',
  'BTC-Legacy': '🟡 Bitcoin Legacy (BIP-44)',
  'BTC-NestedSegWit': '🟠 Bitcoin Nested SegWit (BIP-49)',
  'BTC-NativeSegWit': '🟢 Bitcoin Native SegWit (BIP-84)',
}

export default function AddressDisplay({ wallet, onContinue }: Props) {
  const copy = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className="step">
      <h2>Step 2: Your Addresses</h2>
      <p>Master Fingerprint: <code>{wallet.masterFingerprint}</code></p>

      <table className="address-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Derivation Path</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {wallet.addresses.map((addr) => (
            <tr key={addr.path}>
              <td>{TYPE_LABELS[addr.type] || addr.type}</td>
              <td><code>{addr.path}</code></td>
              <td>
                <code className="address">
                  {addr.address.slice(0, 12)}...{addr.address.slice(-6)}
                </code>
                <button
                  onClick={() => copy(addr.address)}
                  title="Copy full address"
                  className="btn-copy"
                >
                  📋
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={onContinue} className="btn-primary">
        Sign a Message →
      </button>
    </div>
  )
}
