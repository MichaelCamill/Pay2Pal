#!/usr/bin/env bash
# PayAgent: One-Click Setup & Launch Script for macOS and Linux
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "================================================================"
echo "  PayAgent: Autonomous Agentic Commerce via PayPal Platform"
echo "================================================================"
echo ""

# 1. Check Node.js
if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js is not installed! Please install Node.js from https://nodejs.org/"
  exit 1
fi
echo "Node.js detected: $(node -v)"

# 2. Check npm
if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm is not installed!"
  exit 1
fi
echo "npm detected: $(npm -v)"

# 3. Setup .env
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
  else
    echo "PORT=3000" > .env
    echo "USE_SIMULATOR=true" >> .env
    echo "Created default .env"
  fi
else
  echo ".env verified"
fi

# 4. Check dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies (express, cors, dotenv)..."
  npm install
else
  echo "Dependencies already installed"
fi

# 5. Run tests
echo "Running verification test suite..."
npm test || echo "[WARNING] Tests had warnings, continuing to launch..."

echo ""
echo "================================================================"
echo "  PayAgent running at http://localhost:3000"
echo "  Opening browser..."
echo "  Press Ctrl+C to stop the server anytime."
echo "================================================================"
echo ""

# Launch default browser
if command -v open >/dev/null 2>&1; then
  (sleep 2 && open http://localhost:3000) &
elif command -v xdg-open >/dev/null 2>&1; then
  (sleep 2 && xdg-open http://localhost:3000) &
fi

node server.js
