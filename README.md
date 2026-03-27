## Prerequisites

- Node.js v20+ (required)
- Install: nvm install 20 && nvm use 20


## Quick Start

    git clone https://github.com/ygd58/shell-dapp-poc
    cd shell-dapp-poc
    npm install
    npm run dev

Then open http://localhost:5173 in your browser.
Requires Node.js v20+: nvm install 20 && nvm use 20

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Demo Output

Running locally:

    $ npm run dev
    VITE v8.0.2  ready in 181 ms
    Local:   http://localhost:5173/

Open http://localhost:5173 in browser:

    Step 1: Connect — click "Use Mock Wallet (Testing)"
    Step 2: Addresses — see BIP-44/49/84 addresses displayed
    Step 3: Sign — enter message, select key, click "Mock Sign"
    Result: Signature displayed ✅

## Connect with Real Shell Device

1. On Shell: Watch-only Wallet -> Connect -> show QR
2. In dApp: click "Scan Shell QR Code"
3. Addresses appear for all derivation paths
4. Enter message -> Generate QR -> Shell scans -> returns signature

## Derivation Paths Supported

| BIP | Type | Path |
|-----|------|------|
| BIP-44 | Ethereum | m/44'/60'/0'/0/0 |
| BIP-44 | Bitcoin Legacy | m/44'/0'/0'/0/0 |
| BIP-49 | Nested SegWit | m/49'/0'/0'/0/0 |
| BIP-84 | Native SegWit | m/84'/0'/0'/0/0 |
