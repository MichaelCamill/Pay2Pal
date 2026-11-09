const express = require('express');
const cors = require('cors');
const path = require('path');
const { getConfig, updateConfig } = require('./src/config');
const store = require('./src/store');
const agentService = require('./src/agentService');
const paypalService = require('./src/paypalService');

const app = express();
const config = getConfig();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. Get system status & wallet stats
app.get('/api/agent/status', (req, res) => {
  const currentConfig = getConfig();
  const stats = store.getStats();
  const policy = store.getPolicy();
  const pendingApprovals = store.getAllPendingHITL();

  res.json({
    stats,
    policy,
    config: {
      paypalEnv: currentConfig.paypalEnv,
      useSimulator: currentConfig.useSimulator,
      hasCredentials: Boolean(currentConfig.paypalClientId && currentConfig.paypalClientSecret),
      clientIdMasked: currentConfig.paypalClientId ? `${currentConfig.paypalClientId.slice(0, 8)}...${currentConfig.paypalClientId.slice(-4)}` : null
    },
    pendingApprovals
  });
});

// 2. Process natural language commercial intent
app.post('/api/agent/intent', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid prompt string.' });
  }

  try {
    const result = await agentService.processIntent(prompt);
    res.json(result);
  } catch (err) {
    console.error('[API] processIntent error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Human-in-the-Loop approval / rejection
app.post('/api/agent/hitl-action', async (req, res) => {
  const { transactionId, action } = req.body;
  if (!transactionId || !['APPROVE', 'REJECT'].includes(action)) {
    return res.status(400).json({ error: 'Invalid parameters. transactionId and action (APPROVE/REJECT) are required.' });
  }

  try {
    const result = await agentService.handleHitlAction(transactionId, action);
    res.json(result);
  } catch (err) {
    console.error('[API] handleHitlAction error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Update Policy Guardrails
app.post('/api/policy/update', (req, res) => {
  try {
    const updated = store.updatePolicy(req.body);
    res.json({ success: true, policy: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Update PayPal Sandbox Configuration
app.post('/api/paypal/config', async (req, res) => {
  const { paypalClientId, paypalClientSecret, useSimulator, paypalEnv } = req.body;
  
  const updates = {};
  if (paypalClientId !== undefined) updates.paypalClientId = paypalClientId.trim();
  if (paypalClientSecret !== undefined) updates.paypalClientSecret = paypalClientSecret.trim();
  if (useSimulator !== undefined) updates.useSimulator = Boolean(useSimulator);
  if (paypalEnv !== undefined) updates.paypalEnv = paypalEnv;

  const newConfig = updateConfig(updates);

  // If credentials are provided and simulator is false, test live connection
  let testResult = null;
  if (!newConfig.useSimulator && newConfig.paypalClientId && newConfig.paypalClientSecret) {
    testResult = await paypalService.testConnection(newConfig.paypalClientId, newConfig.paypalClientSecret);
  }

  res.json({
    success: true,
    config: {
      paypalEnv: newConfig.paypalEnv,
      useSimulator: newConfig.useSimulator,
      hasCredentials: Boolean(newConfig.paypalClientId && newConfig.paypalClientSecret)
    },
    testResult
  });
});

// 6. Test PayPal Sandbox Connection
app.get('/api/paypal/test', async (req, res) => {
  const currentConfig = getConfig();
  if (!currentConfig.paypalClientId || !currentConfig.paypalClientSecret) {
    return res.json({
      success: false,
      message: 'No PayPal Sandbox credentials configured. Currently running in simulation mode.'
    });
  }

  const result = await paypalService.testConnection(currentConfig.paypalClientId, currentConfig.paypalClientSecret);
  res.json(result);
});

// 7. Get Transaction Ledger
app.get('/api/transactions', (req, res) => {
  res.json({ transactions: store.getTransactions() });
});

// 7a. PayPal Smart Buttons - Create Order
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { amount = '25.00', currency = 'USD', description = 'PayPal Sandbox Checkout', items = [] } = req.body;
    const order = await paypalService.createOrder({
      amount: parseFloat(amount),
      currency,
      description,
      items
    });
    res.json({ id: order.orderId, ...order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7b. PayPal Smart Buttons - Capture Order
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderId, amount = 25.00, description = 'PayPal Checkout Payment', recipient = 'Merchant' } = req.body;
    const capture = await paypalService.captureOrder(orderId);
    
    // Deduct spend from wallet balance
    store.recordSpend(parseFloat(amount));

    // Record in ledger
    const tx = store.addTransaction({
      type: 'PURCHASE',
      status: 'COMPLETED',
      description,
      merchant: recipient,
      amount: parseFloat(amount),
      currency: 'USD',
      riskScore: 10,
      riskLevel: 'LOW',
      paypalOrderId: orderId,
      paypalCaptureId: capture.captureId,
      approvalMode: 'PAYPAL_SMART_BUTTON',
      details: { capture }
    });

    res.json({ success: true, capture, transaction: tx });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7c. Direct Send Money (Standard PayPal consumer flow)
app.post('/api/paypal/send-money', async (req, res) => {
  try {
    const { recipient, amount, note = 'PayPal Transfer' } = req.body;
    if (!recipient || !amount) {
      return res.status(400).json({ error: 'Recipient and amount are required.' });
    }

    const numAmount = parseFloat(amount);
    const order = await paypalService.createOrder({
      amount: numAmount,
      description: `Transfer to ${recipient}: ${note}`,
      merchantName: recipient
    });

    const capture = await paypalService.captureOrder(order.orderId);
    store.recordSpend(numAmount);

    const tx = store.addTransaction({
      type: 'MONEY_TRANSFER',
      status: 'COMPLETED',
      description: `Sent to ${recipient}`,
      merchant: recipient,
      amount: numAmount,
      currency: 'USD',
      riskScore: 15,
      riskLevel: 'LOW',
      paypalOrderId: order.orderId,
      paypalCaptureId: capture.captureId,
      approvalMode: 'DIRECT_SEND',
      details: { note, capture }
    });

    res.json({ success: true, transaction: tx });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Reset Demo State
app.post('/api/demo/reset', (req, res) => {
  store.resetState();
  res.json({ success: true, message: 'Sandbox wallet and state reset successfully.' });
});

// 9. PayPal Return & Cancel Handlers
app.get('/sandbox/checkout-success', (req, res) => {
  res.send(`
    <html>
      <head><title>PayPal Sandbox Approval</title><style>body{font-family:sans-serif;text-align:center;padding:50px;background:#f8fafc;color:#0f172a;}</style></head>
      <body>
        <h1 style="color:#10b981;">✓ PayPal Sandbox Order Approved</h1>
        <p>The buyer has authorized the order on the PayPal Sandbox rail.</p>
        <p>You can return to the PayAgent dashboard.</p>
        <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#0284c7;color:#fff;text-decoration:none;border-radius:6px;">Return to PayAgent</a>
      </body>
    </html>
  `);
});

app.get('/sandbox/checkout-cancel', (req, res) => {
  res.send(`
    <html>
      <head><title>PayPal Sandbox Checkout Canceled</title><style>body{font-family:sans-serif;text-align:center;padding:50px;background:#f8fafc;color:#0f172a;}</style></head>
      <body>
        <h1 style="color:#ef4444;">Checkout Canceled</h1>
        <p>The buyer canceled the sandbox checkout session.</p>
        <a href="/" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#64748b;color:#fff;text-decoration:none;border-radius:6px;">Return to PayAgent</a>
      </body>
    </html>
  `);
});

const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 PayAgent Autonomous Commerce Prototype is running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🛡️ Policy Sandbox: $${store.getPolicy().autoSpendThreshold} Micro-Spend Threshold`);
  console.log(`⚡ Mode: ${config.useSimulator ? 'Interactive Sandbox Simulator' : 'Live PayPal Sandbox API'}`);
  console.log(`====================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n====================================================`);
    console.log(`ℹ️  PayAgent is already running on http://localhost:${PORT}`);
    console.log(`🌐 Opening http://localhost:${PORT} in your browser...`);
    console.log(`====================================================\n`);
  } else {
    console.error('Server error:', err);
  }
});
