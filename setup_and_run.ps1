# PayAgent - One-Click Setup & Launcher (PowerShell)
# Usage: Right-click -> "Run with PowerShell" or execute .\setup_and_run.ps1

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  PayAgent: Autonomous Agentic Commerce via PayPal Platform" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# 1. Check Node.js
Write-Host "[1/5] Checking Node.js runtime..." -ForegroundColor Yellow
try {
    $nodeVer = (node -v).Trim()
    Write-Host "      Detected Node.js: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "  [X] Node.js is not installed!" -ForegroundColor Red
    Write-Host "      Please download Node.js (v18+) from: https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# 2. Check npm
Write-Host "[2/5] Checking npm package manager..." -ForegroundColor Yellow
try {
    $npmVer = (npm -v).Trim()
    Write-Host "      Detected npm: $npmVer" -ForegroundColor Green
} catch {
    Write-Host "  [X] npm is missing!" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# 3. Environment file
Write-Host "[3/5] Verifying environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "      Created .env from .env.example" -ForegroundColor Green
    } else {
        @"
PORT=3000
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=sandbox
USE_SIMULATOR=true
"@ | Out-File -FilePath ".env" -Encoding utf8
        Write-Host "      Generated default .env" -ForegroundColor Green
    }
} else {
    Write-Host "      .env file is present" -ForegroundColor Green
}

# 4. Check dependencies
Write-Host "[4/5] Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "      Installing npm packages..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "      Dependencies already installed." -ForegroundColor Green
}

# 5. Run test suite
Write-Host "[5/5] Running automated verification test suite..." -ForegroundColor Yellow
npm test

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "  Setup Complete! Starting PayAgent server..." -ForegroundColor Green
Write-Host "  Opening http://localhost:3000 in your default browser..." -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop the server anytime." -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""

# Launch browser after 2 seconds in background job
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"
} | Out-Null

# Start server
node server.js
