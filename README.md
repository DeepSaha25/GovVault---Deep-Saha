# 🏛️ GovVault — DAO Governance with Quadratic Voting & Treasury Executor

GovVault is a decentralized governance and funding platform built on **Stellar Soroban**. It enforces a fair voting mechanism called **Quadratic Voting** to protect decentralized organizations from plutocratic (whale-dominated) outcomes and utilizes a **Timelocked Treasury Executor** to lock and safely release funding allocations on-chain.

## 🔗 Live Submission Links

- **Live Demo**: [gov-vault-deep-saha.vercel.app](https://gov-vault-deep-saha.vercel.app/)
- **Public GitHub Repository**: [GitHub Repository](https://github.com/DeepSaha25/GovVault)



### 🔴 The Problem
Traditional decentralized autonomous organization (DAO) governance and treasury management face critical vulnerabilities:
- **Plutocratic Dominance (Whale Control)**: Standard token-weighted voting systems ($1 \text{ token} = 1 \text{ vote}$) allow wealthy "whales" to easily override the majority community's preferences, centralizing power and silencing minority contributors.
- **Treasury Vulnerability (Hostile Takeovers)**: Many governance systems execute funding payouts immediately upon proposal completion. This makes DAOs vulnerable to sudden governance takeovers, exploit proposals, or malicious drainages before the community can react.
- **High Fees for Decentralized Action**: Executing complex governance rules and multiple token voting options on L1 blockchains can cost users massive gas fees, discouraging participation.

### 🟢 The Solution
GovVault addresses these inefficiencies by leveraging Stellar’s ultra-low fees and Soroban’s smart contract interoperability:
- **On-Chain Quadratic Voting**: Governs with a cost scale of $cost = \text{votes}^2$ (e.g., 1 vote costs 1 token, 5 votes cost 25 tokens). This curbs whale dominance by making concentrated votes exponentially expensive, balancing power towards broad community consensus.
- **Timelocked Treasury Executor (ICC)**: Implements split-contract security. Upon proposal approval, the Governor contract calls the Treasury contract via Inter-Contract Communication (ICC) to timelock the funds. This delay provides a critical security buffer for the community to inspect, veto, or freeze the allocation if a malicious takeover is detected.
- **Frictionless Governance**: Capitalizes on Stellar’s speed and near-zero transaction fees to enable active, low-cost community-driven decision-making and micro-grant funding at scale.

---

## 🚀 Deployed Testnet Specifications

*   **Governor Contract Address**: `CBDPX5ABBW75O3M2JWD5S66ZUL2VDCTOVNCQFZ4YO4KE4VW5APB3S45Y`
*   **Treasury Contract Address**: `CB4W5E3X4K4MXJAMZNMTLGYAUE7PM44D73TIEQ64EZQ4UQ3MDGYH2ZJB`
*   **Stellar Network**: Testnet

---

## 🌟 Core Requirements Fulfillment & Project Features

GovVault is designed and built to address all technical requirements for production-grade Soroban decentralized applications:

### 1. Advanced Smart Contract Development
- **Custom Soroban Contracts**: Implements two custom contracts in Rust using the Soroban SDK: the **Governor Contract** and the **Treasury Contract**.
- **On-Chain Quadratic Voting Logic**: Formulates and enforces voting costs dynamically on-chain ($cost = \text{votes}^2$). It deducts the quadratic cost in tokens/voting power from the voter's address to safeguard the governance pool from whale manipulation.
- **State Machine Management**: Tracks proposal states (`Active`, `Passed`, `Executed`, `Failed`) using persistent storage keys on the ledger.

### 2. Inter-Contract Communication (ICC)
- **Cross-Contract Invocations**: Upon successful proposal evaluation, the Governor contract makes a secure cross-contract call (`env.invoke_contract`) to the Treasury contract.
- **Timelock Treasury Lockup**: The Governor instructs the Treasury contract to register a timelock allocation for the approved recipient. Payout execution is locked until the timelock duration expires.

### 3. Event Streaming & Real-Time Updates
- **Soroban RPC Event Streaming**: Frontend subscribes to contract event logs directly from the Soroban RPC server (`getEvents` API).
- **Live Governance Log**: Rendered on the dashboard as a live activity stream, displaying contract topics, event payloads, ledger block indices, and clickable transaction hash links opening in Stellar Expert.

### 4. CI/CD Pipeline Setup
- **Automated Workflow**: Fully configured in `.github/workflows/ci.yml`.
- **Validation Pipeline**: Automatically compiles smart contracts to `wasm32`, runs cargo contract tests, checks lints/types via Next.js (`eslint`), runs Vitest suites, and verifies full production compilation.

### 5. Smart Contract Deployment Workflow
- **Deployment Strategy**: Automated setup using standard Stellar CLI commands.
- **Linking Flow**: Documented commands for generating keys, deploying Governor and Treasury WASM modules, and linking them via the initial handshake (`initialize` calls).

### 6. Mobile Responsive Frontend Development
- **Tailwind Grid & Layout**: Responsive dashboard optimized with Tailwind CSS layouts, supporting mobile viewports, dynamic sidebars, card columns, and interactive elements.

### 7. Error Handling & Loading States
- **Block Mining Loading indicators**: Triggers transaction loading spinners and disabled inputs while waiting for Soroban transaction completion.
- **Error Interceptors**: Captures Freighter rejection errors, invalid input amounts, or address parsing errors, rendering clean toast notifications.

### 8. Comprehensive Unit Testing
- **Smart Contract Tests**: Rust tests verifying the proposal lifecycle, quadratic vote cost calculations, and contract-to-contract callback sequences.
- **Frontend Test Suite**: 12 Vitest unit tests checking utility formatting helpers (stroops-to-XLM, address truncation) and React UI components.

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS (Monochromatic zinc dark-mode theme)
- **Contracts**: Rust (Soroban SDK `22.0.11`)
- **Stellar Integration**: `@stellar/stellar-sdk` & `@creit.tech/stellar-wallets-kit`
- **Testing**: Vitest + JSDOM for frontend; Cargo test for Rust contracts

---

## 💻 Local Installation & Getting Started

### 📋 Prerequisites
- Node.js 18+ or 20+
- Cargo + Rust Toolchain (with `wasm32-unknown-unknown` target)
- Freighter Wallet extension installed

### 🛠️ Step-by-Step Setup

1. **Navigate to the GovVault Directory**:
   ```bash
   cd "GovVault - Deep Saha"
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root with the following configuration:
   ```env
   NEXT_PUBLIC_GOVERNOR_CONTRACT_ID=CB56DGFX43XUXN2OASKM3SF6I3WWNYUM6KE7HKUKX3JSLZPYQSRQXOHH
   NEXT_PUBLIC_TREASURY_CONTRACT_ID=CBAFHUW7TL73RG4KYSL53ZF4N4NCJK76KXL3NHKEDDWE2GPVHA52LJ47
   NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-rpc.testnet.stellar.org
   ```

3. **Install Dependencies**:
   ```bash
   npm install --ignore-scripts
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Run the Test Suite**:
   *   **Frontend Tests**: `npm run test`
   *   **Rust Contract Tests**:
       ```bash
       cd contracts/governor-contract && cargo test
       ```

---

## 📄 License
This project is licensed under the MIT License.
