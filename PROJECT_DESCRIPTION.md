# PayAgent: Autonomous Agentic Commerce via PayPal Developer Platform

> **Submission Category:** Best Use of Agentic Commerce | Best Use of PayPal + AI | 1st Place Overall  

---

## 💡 Elevator Pitch
**PayAgent** transforms online payments from a passive, manual form-filling chore into an autonomous, policy-governed agentic commerce layer. Powered by the **PayPal Developer Platform**, PayAgent allows users to delegate high-level commercial outcomes (*"Procure 2 ergonomic monitors under $200 each"* or *"Auto-refill $15 API tokens"*), while a deterministic **Enforced Policy Sandbox** safely governs agent spending with autonomous micro-spends, dynamic risk scoring, and interactive Human-in-the-Loop approvals.

---

## 🎯 Inspiration & The Problem
Traditional payment systems (such as UPI, Apple Pay, credit cards, or legacy checkout buttons) are **passive rails**: they move money only when a human manually discovers a vendor, extracts their payment handle, calculates taxes, and inputs an authorization credential (e.g., MPIN, SMS OTP, or biometric scan).

Furthermore, in the emerging era of autonomous AI agents and machine-to-machine (M2M) commerce, developers face the unsolved **"Agent Wallet" Dilemma**:
* **How can an autonomous software agent spend money safely without having unfettered access to drain a bank account or credit line?*
* Traditional mandates are too rigid (fixed calendar subscriptions), while raw credit card API keys create catastrophic financial liability.

**PayAgent solves this problem** by pairing PayPal's global multi-currency sandbox rails with an intelligent, policy-governed AI commerce orchestrator.

---

## ✨ Key Features & Functionality

### 1. Authentic PayPal Portal Experience
PayAgent isn't an abstract terminal tool—it is built directly into an authentic clone of the **official PayPal Web Application**:
* **Iconic Visual Identity:** Deep Navy PayPal Header (`#003087`), overlapping dual-P logo, clean light gray background (`#f5f7fa`), and official pill-shaped buttons (`#0070ba` and `#ffc439`).
* **Live Account Balances:** Displays an authentic **`$4,825.50 Available in USD`** balance that dynamically deducts on checkout/micro-spends and credits on invoice settlements.
* **Official PayPal Smart Payment Buttons:** Integrates the official **PayPal JavaScript SDK v5**, rendering genuine yellow **PayPal** and black **Debit or Credit Card** buttons with live sandbox checkout modals.
* **Five Authentic Tabs:** *Dashboard*, *Send & Request*, *Wallet*, *Activity*, and the *⚡ PayAgent AI* Copilot.

### 2. Commercial Intent Console ("Set Goal & Delegate")
Instead of manually navigating checkout funnels, users state their commercial objective in plain natural language:
* *"Purchase 50,000 API inference tokens on OpenRouter for $15"*
* *"Procure 2 ergonomic monitors for $189 each from BestBuy"*
* *"Generate and send PayPal invoice for $350 React milestone to client@startup.io"*
The AI engine decomposes the request, identifies the merchant, verifies domain trust, itemizes line items, and stages the transaction.

### 3. Solving the "Agent Wallet" Problem: The Enforced Policy Sandbox
Before any PayPal API is called, transactions are deterministically evaluated server-side:
* **Autonomous Micro-Spend ($\le \$25.00$):** Routine low-value purchases with whitelisted vendors auto-execute and capture immediately on PayPal Sandbox without human intervention.
* **Context-Aware Dynamic Risk Scoring (0–100):** Evaluates transaction magnitude relative to daily budget, vendor whitelist status, and historical price deltas.
* **Human-in-the-Loop (HITL) Intercepts ($> \$25.00$ or Unverified Vendors):** The agent halts spending, stages the order on PayPal Sandbox (`ORDER-SB-xxxx`), and displays an interactive approval card with risk metrics and 1-click authorization.
* **Deterministic Ceilings:** Strict daily budget limits (`$500.00`) and single transaction caps (`$1,000.00`) prevent unauthorized spending.

### 4. Automated B2B Invoicing Copilot
* Ingests contract agreements, conversation logs, or deliverable descriptions.
* Programmatically calculates line items and dispatches an authentic PayPal invoice via the **PayPal Invoicing API v2** (`/v2/invoicing/invoices` & `/send`).

### 5. Live Agent Reasoning Pipeline & REST Telemetry
* Users and judges can watch the agent's internal chain-of-thought in real time:
  1. *Intent Dissection & Entity Extraction*
  2. *Deterministic Policy Sandbox Evaluation*
  3. *PayPal Orders v2 / Invoicing Staging*
  4. *HITL Pause or Autonomous Dispatch*
  5. *PayPal Capture & Balance Settlement*

### 6. Dual-Engine Sandbox Architecture
* **Live PayPal Sandbox REST API:** Add your PayPal Sandbox Client ID & Secret in the Developer Settings modal to communicate directly with `https://api-m.sandbox.paypal.com`. Includes a real-time OAuth connection tester.
* **Interactive Sandbox Simulator:** Pre-configured to run out-of-the-box with zero setup, returning authentic PayPal schemas, order IDs, and realistic network latencies.

### 7. One-Click Setup & Launch (`start.bat`)
* Double-clicking **`start.bat`** in Windows Explorer automatically verifies Node.js, installs dependencies, creates `.env`, runs unit tests, and launches the application in your default browser.

---

## 🛠️ How We Built It (Tech Stack)

* **PayPal Developer Platform:**
  - **Orders API v2:** `/v2/checkout/orders` (Order creation and staging)
  - **Capture API:** `/v2/checkout/orders/{id}/capture` (Payment capture and settlement)
  - **Invoicing API v2:** `/v2/invoicing/invoices` (B2B draft creation and email dispatch)
  - **OAuth 2.0:** `/v1/oauth2/token` (Bearer token generation)
  - **PayPal JavaScript SDK v5:** Official Smart Payment Buttons client-side integration
* **AI & NLP Pipeline:**
  - Multi-tier LLM engine supporting **Google Gemini 1.5 Flash** and **OpenAI GPT-4o-mini** for semantic intent decomposition, with a zero-latency deterministic NLP engine fallback.
  - Contextual Risk Scoring Algorithm (evaluates spend-to-budget ratios, vendor reputation, and anomaly deltas).
* **Backend:** Node.js, Express 5, CORS, Dotenv, Crypto.
* **Frontend:** Modern responsive JavaScript, Tailwind CSS, Open Sans typography, SVG brand assets, and custom glassmorphism components.

---

## 🧪 What We Tested & Verified
The project includes an automated test suite (`npm test`) verifying:
1. Autonomous micro-spend auto-capture under $\$25$.
2. Human-in-the-Loop intercept triggering for orders exceeding $\$25$.
3. Human approval state machine and PayPal capture settlement.
4. B2B Invoicing draft creation and dispatch.
5. Deterministic safety guardrail block when exceeding daily budget ceilings.

---

## 🚀 What's Next for PayAgent
* **Multi-Agent Negotiation Protocols:** Buyer agents negotiating pricing with seller agents using PayPal Escrow and Payouts APIs.
* **Real-Time Stream Micro-Tipping (StreamBounty AI):** Multimodal vision AI continuously validating livestream game states and executing conditional micropayments via PayPal Payouts.
