import { useState } from 'react'
import { type WalletState, type AppStep } from './types'
import ConnectStep from './components/ConnectStep'
import AddressDisplay from './components/AddressDisplay'
import SignStep from './components/SignStep'
import './App.css'

export default function App() {
  const [step, setStep] = useState<AppStep>('connect')
  const [wallet, setWallet] = useState<WalletState | null>(null)

  return (
    <div className="app">
      <header>
        <h1>🔐 Shell dApp Integration PoC</h1>
        <p>LP-0010 — λPrize | Airgapped QR Signing</p>
      </header>

      <div className="steps">
        <span className={step === 'connect' ? 'active' : step === 'sign' || step === 'addresses' ? 'done' : ''}>
          1. Connect
        </span>
        <span>→</span>
        <span className={step === 'addresses' ? 'active' : step === 'sign' ? 'done' : ''}>
          2. Addresses
        </span>
        <span>→</span>
        <span className={step === 'sign' ? 'active' : ''}>
          3. Sign
        </span>
      </div>

      {step === 'connect' && (
        <ConnectStep onConnected={(w) => { setWallet(w); setStep('addresses') }} />
      )}
      {step === 'addresses' && wallet && (
        <AddressDisplay wallet={wallet} onContinue={() => setStep('sign')} />
      )}
      {step === 'sign' && wallet && (
        <SignStep wallet={wallet} />
      )}
    </div>
  )
}
