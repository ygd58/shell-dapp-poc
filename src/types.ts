export interface DerivedAddress {
  path: string;
  type: 'ETH' | 'BTC-Legacy' | 'BTC-NestedSegWit' | 'BTC-NativeSegWit';
  address: string;
  publicKey: string;
}

export interface WalletState {
  masterFingerprint: string;
  addresses: DerivedAddress[];
}

export type AppStep = 'connect' | 'addresses' | 'sign';
