## DAO Voting Platform — Frontend (Next.js)

Decentralized governance UI for creating proposals and casting votes on-chain. Built with Next.js App Router, React 19, Tailwind CSS, and Ethers v6. Defaults to Polygon Mainnet.

### Tech stack
- **Framework**: Next.js 15 (App Router), React 19
- **Blockchain**: Ethers v6, MetaMask
- **Styling**: Tailwind CSS 4, shadcn/ui components

### Prerequisites
- Node.js >= 18.18 (Node 20+ recommended)
- Package manager: pnpm (preferred) or npm
- MetaMask browser extension

### Quick start
```bash
cd frontend

# Install dependencies (use one)
pnpm install
# or
npm install

# Start dev server
pnpm dev
# or
npm run dev

# Build for production
pnpm build

# Start production server (after build)
pnpm start
```

### Scripts
- `dev`: Run Next.js in development mode
- `build`: Production build
- `start`: Start production server
- `lint`: Run Next.js lint (build ignores lint/ts errors as configured)

### Contract & network configuration
- Contract address lives in `lib/contract.ts` under `CONTRACT_ADDRESS`.
- Contract ABI is embedded in `lib/contract.ts` (`CONTRACT_ABI`). Ensure it matches the deployed contract.
- Network helpers are in `lib/networks.ts`.
  - Default target is **Polygon Mainnet** (`chainId: 0x89`).
  - On connect, the app checks the network and prompts MetaMask to switch to Polygon Mainnet if needed.

To point the app at a different deployment:
1) Update the address in `lib/contract.ts`:
```ts
export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress'
```
2) If you want to use a different network (e.g., testnet), update `lib/networks.ts` accordingly and align the network check in `checkNetwork()` to the desired `chainId`.

Notes:
- The UI copy may reference “Amoy testnet” in places, but the code targets Polygon Mainnet by default. Adjust `lib/networks.ts` and `CONTRACT_ADDRESS` to match your environment.
- Real transactions on Polygon Mainnet require MATIC for gas.

### Project structure
```
frontend/
  app/                # Next.js App Router pages and layout
    page.tsx          # Landing page (/)
    dao/page.tsx      # DAO UI (connect, create proposals, vote)
  components/
    dao/              # Feature components (wallet, proposals, voting)
    ui/               # shadcn/ui primitives
  lib/
    contract.ts       # Ethers contract hookup, helpers, types
    networks.ts       # MetaMask network add/switch + helpers
    utils.ts          # Utility helpers (className merger)
  public/             # Static assets
  styles/             # Global styles (Tailwind)
  next.config.mjs     # Next.js configuration (build ignores lint/ts errors)
  package.json        # Scripts and dependencies
```

### How it works (high-level)
- Wallet connect flow (MetaMask) is handled in `app/dao/page.tsx` and `components/dao/WalletConnect.tsx`.
- Contract binding comes from `lib/contract.ts#getContract`, using `ethers.BrowserProvider` + signer.
- Proposal lifecycle:
  - Create: `components/dao/ProposalForm.tsx` → `contract.createProposal(title, description)`
  - List/Load: `components/dao/ProposalList.tsx` → reads `proposalCount`, `getProposal`, and user vote state
  - Vote: `components/dao/VotingCard.tsx` → `contract.castVote(proposalId, yesNo)`
- Utility helpers in `lib/contract.ts` format addresses, time, and surface readable error messages for common on-chain errors.

### Environment variables
No `.env` is required for basic operation. RPC endpoints are sourced via MetaMask’s provider; image optimization is disabled in `next.config.mjs`.

### Troubleshooting
- MetaMask not detected: Install MetaMask and refresh the page.
- Wrong network banner: Click the switch button or manually switch to Polygon Mainnet in MetaMask.
- Contract/ABI mismatch: Ensure `CONTRACT_ADDRESS` and `CONTRACT_ABI` match your deployed contract.
- TypeScript/lint errors: The build is configured to ignore TypeScript and ESLint errors (`next.config.mjs`). Fix locally for best DX.
- Package manager: Do not mix pnpm and npm in the same install. Prefer pnpm if you use the included `pnpm-lock.yaml`.

### Routes
- `/` Landing page
- `/dao` Governance UI (connect wallet, create proposals, vote)

### License
For internal/demo use. Add a license if distributing.


## DAO Voting Platform — Frontend (Next.js)

Decentralized governance UI for creating proposals and casting votes on-chain. Built with Next.js App Router, React 19, Tailwind CSS, and Ethers v6. Defaults to Polygon Mainnet.

### Tech stack
- **Framework**: Next.js 15 (App Router), React 19
- **Blockchain**: Ethers v6, MetaMask
- **Styling**: Tailwind CSS 4, shadcn/ui components

### Prerequisites
- Node.js >= 18.18 (Node 20+ recommended)
- Package manager: pnpm (preferred) or npm
- MetaMask browser extension

### Quick start
```bash
cd frontend

# Install dependencies (use one)
pnpm install
# or
npm install

# Start dev server
pnpm dev
# or
npm run dev

# Build for production
pnpm build

# Start production server (after build)
pnpm start
```

### Scripts
- `dev`: Run Next.js in development mode
- `build`: Production build
- `start`: Start production server
- `lint`: Run Next.js lint (build ignores lint/ts errors as configured)

### Contract & network configuration
- Contract address lives in `lib/contract.ts` under `CONTRACT_ADDRESS`.
- Contract ABI is embedded in `lib/contract.ts` (`CONTRACT_ABI`). Ensure it matches the deployed contract.
- Network helpers are in `lib/networks.ts`.
  - Default target is **Polygon Mainnet** (`chainId: 0x89`).
  - On connect, the app checks the network and prompts MetaMask to switch to Polygon Mainnet if needed.

To point the app at a different deployment:
1) Update the address in `lib/contract.ts`:
```ts
export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress'
```
2) If you want to use a different network (e.g., testnet), update `lib/networks.ts` accordingly and align the network check in `checkNetwork()` to the desired `chainId`.

Notes:
- The UI copy may reference “Amoy testnet” in places, but the code targets Polygon Mainnet by default. Adjust `lib/networks.ts` and `CONTRACT_ADDRESS` to match your environment.
- Real transactions on Polygon Mainnet require MATIC for gas.

### Project structure
```
frontend/
  app/                # Next.js App Router pages and layout
    page.tsx          # Landing page (/)
    dao/page.tsx      # DAO UI (connect, create proposals, vote)
  components/
    dao/              # Feature components (wallet, proposals, voting)
    ui/               # shadcn/ui primitives
  lib/
    contract.ts       # Ethers contract hookup, helpers, types
    networks.ts       # MetaMask network add/switch + helpers
    utils.ts          # Utility helpers (className merger)
  public/             # Static assets
  styles/             # Global styles (Tailwind)
  next.config.mjs     # Next.js configuration (build ignores lint/ts errors)
  package.json        # Scripts and dependencies
```

### How it works (high-level)
- Wallet connect flow (MetaMask) is handled in `app/dao/page.tsx` and `components/dao/WalletConnect.tsx`.
- Contract binding comes from `lib/contract.ts#getContract`, using `ethers.BrowserProvider` + signer.
- Proposal lifecycle:
  - Create: `components/dao/ProposalForm.tsx` → `contract.createProposal(title, description)`
  - List/Load: `components/dao/ProposalList.tsx` → reads `proposalCount`, `getProposal`, and user vote state
  - Vote: `components/dao/VotingCard.tsx` → `contract.castVote(proposalId, yesNo)`
- Utility helpers in `lib/contract.ts` format addresses, time, and surface readable error messages for common on-chain errors.

### Environment variables
No `.env` is required for basic operation. RPC endpoints are sourced via MetaMask’s provider; image optimization is disabled in `next.config.mjs`.

### Troubleshooting
- MetaMask not detected: Install MetaMask and refresh the page.
- Wrong network banner: Click the switch button or manually switch to Polygon Mainnet in MetaMask.
- Contract/ABI mismatch: Ensure `CONTRACT_ADDRESS` and `CONTRACT_ABI` match your deployed contract.
- TypeScript/lint errors: The build is configured to ignore TypeScript and ESLint errors (`next.config.mjs`). Fix locally for best DX.
- Package manager: Do not mix pnpm and npm in the same install. Prefer pnpm if you use the included `pnpm-lock.yaml`.

### Routes
- `/` Landing page
- `/dao` Governance UI (connect wallet, create proposals, vote)

### License
For internal/demo use. Add a license if distributing.


