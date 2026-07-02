# 🏛️ GovVault — DAO Governance with Quadratic Voting & Treasury Executor

GovVault is a decentralized governance and funding platform built on **Stellar Soroban**. It enforces a fair voting mechanism called **Quadratic Voting** to protect decentralized organizations from plutocratic (whale-dominated) outcomes and utilizes a **Timelocked Treasury Executor** to lock and safely release funding allocations on-chain.

---
## 📌 Problem & Solution

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


## 📌 Submission Details & Demo Presentation

*   **🌐 Live Production Link**: [gov-vault-deep-saha.vercel.app](https://gov-vault-deep-saha.vercel.app/)
*   **📹 Demo Video Presentation**: [Google Drive Video Demo](https://drive.google.com/file/d/1EO8DCjaJwuHDQBBlmg4BG_jB7pvQm1PA/view?usp=sharing)
*   **💻 GitHub Repository**: [https://github.com/DeepSaha25/GovVault](https://github.com/DeepSaha25/GovVault)
*   **📝 User Feedback Google Form**: [Google Form Link](https://forms.gle/zymyFfKsFQrx8qAX6)
*   **📊 Feedback Responses Sheet**: [Google Sheets Link](https://docs.google.com/spreadsheets/d/1PQkDNuIQFzSu2BWSQYNa0jO8bHfMzpCDkP7QILJYBwQ/edit?resourcekey=&gid=185701227#gid=185701227)

---

## 🚀 Deployed Testnet Specifications

*   **Governor Contract Address**: `CBDPX5ABBW75O3M2JWD5S66ZUL2VDCTOVNCQFZ4YO4KE4VW5APB3S45Y`
*   **Treasury Contract Address**: `CB4W5E3X4K4MXJAMZNMTLGYAUE7PM44D73TIEQ64EZQ4UQ3MDGYH2ZJB`
*   **Stellar Network**: Testnet

---

## 📋 Level 4 Submission Checklist & Proofs

### 1. Proof of 10+ User Wallet Interactions
The project has been successfully shared with community testers. All interactive testing, including proposal creation and quadratic voting, has been captured.
*   **Live Feedback & Transaction Log**: The active wallet addresses and verified transaction hashes are logged in the [Google Sheets Log](https://docs.google.com/spreadsheets/d/1PQkDNuIQFzSu2BWSQYNa0jO8bHfMzpCDkP7QILJYBwQ/edit?resourcekey=&gid=185701227#gid=185701227).

### 2. User Feedback Summary
Based on the feedback collected from 10+ real users:
*   **Ease of Onboarding**: Average score of **4.6 / 5.0**. Users praised the clean monochromatic design and clear wallet status indicators.
*   **Quadratic Voting Math**: Testers noted that the cost-scaling ($cost = \text{votes}^2$) was easy to understand, especially with the real-time cost feedback display.
*   **Key Requests**: Users suggested adding a visual chart representing vote distribution and directly showing the transaction links in success toasts.

### 3. Monitoring & Analytics Integration
We have integrated **Vercel Web Analytics** to track page views, unique visitors, bounce rates, and client-side performance metrics.
![Vercel Web Analytics](./sub%20assets/analytics.png)

---

## 📸 Media Gallery

### 🖥️ Desktop Web UI (Clean Monochromatic Redesign)

#### Landing Screen
![Landing Screen](./sub%20assets/landing%20page.png)

#### Main Dashboard Overview
![Main Dashboard Overview](./sub%20assets/ui2.png)

### 📱 Mobile Responsive Interface

#### Home & Connect Page
![Home & Connect Page](./sub%20assets/mobui1.png)

#### Order Dashboard
![Order Dashboard](./sub%20assets/mobui2.png)

### ⚙️ CI/CD Pipeline
Our GitHub Actions workflow automatically builds the Next.js frontend, runs the lint checkers, compiles the Rust contracts to WebAssembly, and runs both cargo and unit tests upon pushing commits to the main repository:

![CI/CD Pipeline Running](./sub%20assets/cicd.png)

### 📈 Analytics Dashboard
![Vercel Web Analytics Dashboard](./sub%20assets/analytics.png)

---

## 🗣️ User Feedback Implementations

Based on the community feedback collected in June 2026, the following improvements have been successfully implemented:

| Feedback Request | Implementation / Commit |
| :--- | :--- |
| **"Provide a simple visual slider or input calculator on the voting panel that shows exactly how many tokens will be consumed for votes before committing to the transaction (e.g. showing that 4 votes will cost 16 tokens)."** | Replaced numeric input with an interactive range slider for immediate visual feedback on quadratic cost.<br/>[`feat: Add visual slider for quadratic voting cost calculation`](https://github.com/DeepSaha25/GovVault/commit/7bcb712) |
| **"add some guide to the user it would be able to make UX easy and subtle"** | Added a dismissible welcome guide/info banner on the dashboard explaining the quadratic voting rules.<br/>[`feat: Add user guide explaining quadratic voting rules`](https://github.com/DeepSaha25/GovVault/commit/c386317) |
| **"you improve the landing page"** | Enhanced the hero section with dynamic gradient blobs, modern typography, and better shadow highlights.<br/>[`style: Improve landing page UI and hero section`](https://github.com/DeepSaha25/GovVault/commit/9b004b9) |
| **"ui is genuinely good, if there dark mode section it would be more good."** / **"the dark mode is awesome make it default"** | Exposed the ThemeToggle and changed the default application theme to dark mode.<br/>[`feat: Set dark mode as default theme`](https://github.com/DeepSaha25/GovVault/commit/530a01b) |
| **"Adding a sample proposal will help users understand the workflow imo"** | Injected a mock/sample proposal that renders when the on-chain list is empty to let new users preview the voting UI safely.<br/>[`feat: Add sample proposal to help users understand the workflow`](https://github.com/DeepSaha25/GovVault/commit/cacbb8a) |
| **"add voting countdowns to proposals"** / **"Passed proposals should display timelock countdowns"** | Created interactive countdown timers showing remaining voting periods and passed proposal timelocks.<br/>[`feat: add ProposalCountdown component and map endTime in useGovernor hook`](https://github.com/DeepSaha25/GovVault/commit/962ae85) |
| **"make a visual YES/NO bar for each card"** | Added segmented YES/NO horizontal vote distribution bars inside proposal cards.<br/>[`feat: add live countdowns, vote distribution bar, and detail page links to proposal cards`](https://github.com/DeepSaha25/GovVault/commit/9d1cb92) |
| **"Create a dedicated details page for proposals with more information"** | Built a detailed proposal detail view equipped with vote charts, params, and a custom Quadratic vs. Linear what-if comparison analysis.<br/>[`feat: build detailed proposal detail page with vote charts and direct voting console`](https://github.com/DeepSaha25/GovVault/commit/de638bc) and [`feat: create QV vs Linear comparison card and integrate in proposal detail page`](https://github.com/DeepSaha25/GovVault/commit/838792e) |
| **"Show events log table in Analytics page"** | Added a dynamic, formatted Contract Events log history table showing topic layers, payload decoders, block heights, and explorer links on the Analytics page.<br/>[`feat: add recent contract events log table to governance analytics page`](https://github.com/DeepSaha25/GovVault/commit/99d1c35) |
| **"Directly link transaction hashes to block explorers in success messages"** | Upgraded all success toasts (proposal submit, vote, evaluate, release) to display a dynamic, clickable direct link to Stellar Expert.<br/>[`refactor: rename useGovernor to tsx and add explorer links to success toasts`](https://github.com/DeepSaha25/GovVault/commit/fe9f19a) |
| **"Save direct XLM transfer history"** | Polished the direct XLM transfer page to store and show the last 5 successful transfers inside browser local storage.<br/>[`feat: polish direct XLM transfer page and add local transfer history tracker`](https://github.com/DeepSaha25/GovVault/commit/3bf8ef7) |
| **"Integrate GSAP and Three.js for a professional 3D visual theme"** | Embedded a fixed full-screen interactive 3D WebGL consensus particle network and GSAP stagger slide-in hero animations on the landing page.<br/>[`feat: make 3D particle constellation canvas full screen background`](https://github.com/DeepSaha25/GovVault/commit/75dba8a) and [`style: remove solid background from outer page container to make 3D particles canvas visible`](https://github.com/DeepSaha25/GovVault/commit/cf5b1d1) |

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
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS (Monochromatic light theme styling matching Stitch parameters)
- **Contracts**: Rust (Soroban SDK `22.0.11`)
- **Stellar Integration**: `@stellar/stellar-sdk` & `@creit.tech/stellar-wallets-kit`
- **Testing**: Vitest + JSDOM for frontend; Cargo test for Rust contracts
- **Monitoring**: Vercel Web Analytics

---

## 💻 Local Installation & Getting Started

### 📋 Prerequisites
- Node.js 18+ or 20+
- Cargo + Rust Toolchain (with `wasm32-unknown-unknown` target)
- Freighter Wallet extension installed

### 🛠️ Step-by-Step Setup

1. **Clone the Repository and Navigate to the Directory**:
   ```bash
   git clone https://github.com/DeepSaha25/GovVault.git
   cd GovVault
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root with the following configuration:
   ```env
   NEXT_PUBLIC_GOVERNOR_CONTRACT_ID=CBDPX5ABBW75O3M2JWD5S66ZUL2VDCTOVNCQFZ4YO4KE4VW5APB3S45Y
   NEXT_PUBLIC_TREASURY_CONTRACT_ID=CB4W5E3X4K4MXJAMZNMTLGYAUE7PM44D73TIEQ64EZQ4UQ3MDGYH2ZJB
   NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
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
