# PayAgent: Autonomous Agentic Commerce via PayPal Developer Platform

[![PayPal Developer Platform](https://img.shields.io/badge/PayPal-Developer%20Sandbox-003087?style=flat&logo=paypal)](https://developer.paypal.com)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-black?style=flat&logo=express)](https://expressjs.com)
[![PayPal JS SDK](https://img.shields.io/badge/PayPal-Smart%20Payment%20Buttons-ffc439?style=flat&logo=paypal)](https://developer.paypal.com/docs/checkout/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A full-stack, interactive prototype combining the **authentic PayPal web application experience** with **autonomous agentic commerce**, built directly on the specifications of [`INNOVATION_AND_DIFFERENTIATION.md`](./INNOVATION_AND_DIFFERENTIATION.md).

PayAgent shifts online payments from a **manual form-filling chore** into an **autonomous, policy-governed agentic workflow** powered by the **PayPal Developer Platform & Sandbox Rails**.

---

## 📸 The Authentic PayPal Website Experience

The prototype faithfully mirrors the look, feel, and interaction patterns of the official **PayPal Web Application**:

1. **Iconic Visual Identity:**
   - Deep Navy PayPal Header (`#003087`) with the official dual-P overlapping logo.
   - Clean light gray background (`#f5f7fa`), rounded card containers, and official pill-shaped action buttons (`#0070ba` and `#ffc439`).
2. **Live Account Balance:**
   - Displays real-time available funds (**`$4,825.50 USD`**), which dynamically deducts upon payment capture / micro-spends and credits upon invoice settlement.
3. **Official PayPal Smart Payment Buttons:**
   - Integrated with the **PayPal JavaScript SDK v5** (`https://www.paypal.com/sdk/js?client-id=test&currency=USD&components=buttons`).
   - Renders genuine yellow **PayPal** and black **Debit or Credit Card** buttons inside the Express Checkout module.
   - Triggers the official PayPal Sandbox checkout flow with real order creation and capture.
4. **Five Authentic Portal Tabs:**
   - **Dashboard:** PayPal Balance, Express Checkout with Smart Buttons, and Recent Activity feed with merchant initials and timestamps.
   - **Send & Request:** Transfer funds directly to any recipient by email or handle with personalized notes.
   - **Wallet:** Review funding sources (Chase Visa •••• 4128, Bank of America •••• 9031) and connected Sandbox credentials.
   - **Activity:** Full filterable transaction ledger with PayPal Order IDs (`ORDER-SB-xxxx`), Capture IDs, and clickable JSON inspection.
   - **⚡ PayAgent AI:** The autonomous agentic commerce copilot.

---

## 🧠 How & Where AI is Used

In PayAgent, AI is an **autonomous commercial decision-maker** rather than a passive chatbot:

```
[ User Natural Language Intent ]
               │
               ▼
┌──────────────────────────────────────────────┐
│  1. Intent Extraction & Schema Dissection    │  <-- src/agentService.js (Gemini / GPT / Local NLP)
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  2. Enforced Policy Sandbox & Risk Scoring   │  <-- src/policyEngine.js (Solves "Agent Wallet" Problem)
└──────────────┬────────────────┬──────────────┘
               │                │
        (Amount ≤ $25)    (Amount > $25 or High Risk)
               │                │
               ▼                ▼
┌────────────────────────┐  ┌────────────────────────────────────┐
│ 3. Autonomous Execution│  │ 4. Human-in-the-Loop (HITL) Intercept│
│  Auto-Order & Capture  │  │  Order Staged + Risk Meter + Card  │
└──────────────┬─────────┘  └─────────────────┬──────────────────┘
               │                              │ (Human Approves)
               └──────────────┬───────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────┐
│  5. PayPal Sandbox Orders / Invoicing v2 API │  <-- src/paypalService.js (api-m.sandbox.paypal.com)
└──────────────────────────────────────────────┘
```

### 1. Intent-Based Commerce Dissection ([`src/agentService.js`](./src/agentService.js))
- Ingests unstructured commercial intent (e.g. *"Procure 2 ergonomic monitors under $200 each from BestBuy"*).
- Uses an LLM pipeline (**Google Gemini 1.5 Flash** or **OpenAI GPT-4o-mini**, with automatic fallback to a local deterministic NLP parser) to extract structured commercial schemas (action, merchant, quantity, line items, and unit prices).

### 2. Solving the "Agent Wallet" Problem ([`src/policyEngine.js`](./src/policyEngine.js))
- Autonomous agents buying cloud compute, API tokens, or inventory cannot be granted unrestricted access to a bank account.
- PayAgent enforces deterministic guardrails **server-side before any PayPal API is called**:
  - **Daily Wallet Spend Limit:** Default `$500.00` daily cap.
  - **Single Transaction Ceiling:** Default `$1,000.00` ceiling.
  - **Verified Merchant Whitelist:** Trusted vendor domain verification (`bestbuy.com`, `openrouter.ai`, `aws.amazon.com`, etc.).

### 3. Contextual Dynamic Risk Scoring ([`src/policyEngine.js`](./src/policyEngine.js))
- Computes a dynamic risk score (**0 to 100**) based on:
  - Spend-to-daily-budget saturation ratio.
  - Merchant whitelist verification.
  - Item category and transaction magnitude.

### 4. Autonomous Micro-Spends vs. Human-in-the-Loop (HITL) Intercepts
- **Autonomous Micro-Spend ($\le \$25.00$):** Routine purchases with whitelisted vendors auto-settle via PayPal Sandbox without human friction.
- **HITL Intercept ($\gt \$25.00$ or elevated risk):** The AI agent pauses spending, stages the order on PayPal Sandbox, and displays an interactive approval card with risk metrics and 1-click confirmation.

### 5. Automated B2B Invoicing Copilot ([`src/paypalService.js`](./src/paypalService.js))
- Translates project deliverable milestones into itemized B2B invoices and dispatches them programmatically using the **PayPal Invoicing API v2** (`/v2/invoicing/invoices`).

---

## 🌟 The Three Core Innovations (from `INNOVATION_AND_DIFFERENTIATION.md`)

| Dimension | Standard UPI / Legacy Cards | PayAgent (Autonomous Agentic Commerce) |
| :--- | :--- | :--- |
| **Role of AI** | None (Static form input) | **Autonomous Decision Maker:** Researches deals, itemizes specs, verifies merchant trust, and executes transactions. |
| **User Effort** | High: Manual clerk workflow (find handle, type PIN). | **Zero-to-One:** *"Set Goal & Delegate"* (e.g., *"Procure 2 ergonomic monitors under $200 each"*). |
| **Guardrails & Safety** | Rigid binary: Either enters PIN or transaction fails. | **Context-Aware Dynamic Guardrails:** Auto-approves micro-spends ($\le \$25$), invokes HITL for larger/riskier orders. |
| **B2B Invoicing** | Manual link creation. | **Automated Invoicing Copilot:** Ingests agreements and dispatches PayPal invoices programmatically. |
| **M2M Readiness** | Impossible: Requires interactive mobile PIN session. | **Native Machine-to-Machine:** Designed for autonomous agents to buy compute, APIs, and supplies. |
| **Global Scale** | Domestic only (single country). | **Global Cross-Border:** 200+ countries, 25+ currencies, built-in PayPal buyer and seller protection. |

---

## 🛠️ PayPal Developer Sandbox Integration

PayAgent connects to the **PayPal Sandbox REST API** (`https://api-m.sandbox.paypal.com`):

- **OAuth 2.0 Client Credentials:** `/v1/oauth2/token`
- **Orders API v2:** Create and capture payment orders (`/v2/checkout/orders`)
- **Invoicing API v2:** Create draft and send B2B invoices (`/v2/invoicing/invoices`)
- **Dual-Engine Architecture:**
  - **Live Sandbox Mode:** Connect your `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` via `.env` or the in-app Developer Settings modal. Includes a real-time OAuth connection tester.
  - **Interactive Sandbox Simulator:** Pre-configured to run out-of-the-box with zero setup, returning authentic PayPal schemas, order IDs (`ORDER-SB-xxxx`), and capture IDs.

---

## 🚀 Quick Start Guide (For Judges & Evaluators)

### ⚡ Option A: One-Click Automatic Setup (Recommended)
* **On Windows:** Double-click **`start.bat`** (or `setup_and_run.bat`).
* **On macOS / Linux:** Open terminal in the project directory and run:
  ```bash
  bash start.sh
  ```

The one-click script automatically:
1. Detects and verifies your **Node.js** and **npm** installation.
2. Auto-creates the `.env` configuration file from `.env.example` with the zero-config Sandbox Simulator active.
3. Automatically installs all required npm dependencies (`express`, `cors`, `dotenv`).
4. Runs the automated verification test suite (`npm test`).
5. Starts the server and **automatically opens `http://localhost:3000` in your default browser**.

*(Windows PowerShell users can also right-click `setup_and_run.ps1` and select **Run with PowerShell**).*

---

### 💻 Option B: Manual Terminal Setup

#### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- npm (v9 or higher)

#### 1. Install Dependencies
```bash
npm install
```

#### 2. (Optional) Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` if you have live sandbox or AI keys:
```env
PORT=3000
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_ENV=sandbox
USE_SIMULATOR=false

# Optional Cloud LLMs (falls back to built-in local NLP engine if omitted)
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

### 3. Start the Server
```bash
npm start
```
The server will start at:
👉 **`http://localhost:3000`**

---

## 🧪 Demonstration Scenarios

Open **`http://localhost:3000`**, navigate to the **⚡ PayAgent AI** tab, and test the 4 pre-configured scenarios:

### Scenario 1: Autonomous Micro-Spend ($15.00)
- **Prompt:** `"Purchase 50,000 API inference tokens on OpenRouter for $15"`
- **Result:** Within the $\le \$25.00$ policy with a whitelisted vendor $\rightarrow$ **Auto-executed and captured** via PayPal Sandbox without human intervention.

### Scenario 2: Human-in-the-Loop Intercept ($378.00)
- **Prompt:** `"Procure 2 ergonomic monitors for $189 each from BestBuy"`
- **Result:** Exceeds the $\$25.00$ auto-spend cap $\rightarrow$ **Pauses spending**, generates risk score (68/100), and displays the **HITL Interactive Approval Card**. Click *"Authorize & Capture via PayPal Sandbox"* to settle.

### Scenario 3: Autonomous B2B Invoicing ($350.00)
- **Prompt:** `"Generate and send PayPal invoice for $350 React UI milestone to client@startup.io"`
- **Result:** Invokes the **PayPal Invoicing API v2** $\rightarrow$ Creates itemized invoice draft and dispatches payment request to recipient email.

### Scenario 4: Policy Guardrail Rejection ($1,200.00)
- **Prompt:** `"Transfer $1,200 to unknown offshore wallet hardware-pool.biz"`
- **Result:** Exceeds single transaction cap ($\$1,000$) and daily budget ($\$500$) with an unverified vendor $\rightarrow$ **Blocked by Policy Guardrails** before contacting PayPal.

---

## 🔬 Automated Testing

Run the automated test suite covering all agentic workflows and HTTP routes:

```bash
npm test
```

### Verified Test Cases:
1. `[TEST 1]` Autonomous Micro-Spend under $\$25$ (auto-capture).
2. `[TEST 2]` Human-in-the-Loop intercept for purchases exceeding $\$25$.
3. `[TEST 3]` Human authorization state machine & fund settlement.
4. `[TEST 4]` B2B Invoicing draft creation and dispatch.
5. `[TEST 5]` Deterministic safety guardrail block on ceiling breach.

---

## 📁 Repository Structure

```
paypal/
├── INNOVATION_AND_DIFFERENTIATION.md  # Core concept & hackathon differentiation doc
├── README.md                          # Comprehensive documentation
├── package.json                       # Scripts and dependencies
├── server.js                          # Express REST API & static server
├── .env.example                       # Environment template
├── .env                               # Runtime configuration
├── src/
│   ├── config.js                      # Environment & runtime settings
│   ├── store.js                       # Account balances, policies & transaction ledger
│   ├── paypalService.js               # PayPal Sandbox REST client (OAuth, Orders, Invoicing)
│   ├── policyEngine.js                # Deterministic Policy Sandbox & risk scoring engine
│   └── agentService.js                # LLM & NLP intent extraction, reasoning trace
├── public/
│   ├── index.html                     # Authentic PayPal UI & PayAgent dashboard
│   ├── app.js                         # State management, Smart Buttons, tab routing
│   └── styles.css                     # PayPal color variables, typography & pill buttons
└── test/
    ├── test_agent.js                  # Integration test suite for agent workflows
    └── test_http.js                   # HTTP REST endpoints test suite
```

---

## 🏆 Hackathon Alignment

| Award Category | Target | Why This Architecture Wins |
| :--- | :--- | :--- |
| **Best Use of Agentic Commerce** | **$5,000** | Directly solves the "Agent Wallet" dilemma with the Enforced Policy Sandbox and dynamic HITL intercepts. |
| **Best Use of PayPal + AI** | **$5,000** | Deep bidirectional integration across PayPal Orders API v2, Invoicing API, JavaScript SDK Smart Buttons, and LLM orchestration. |
| **1st Place Overall** | **$12,000** | Fully working full-stack product combining authentic PayPal branding with cutting-edge autonomous commerce. |
