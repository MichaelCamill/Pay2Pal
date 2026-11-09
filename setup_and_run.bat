@echo off
setlocal enabledelayedexpansion
title PayAgent - One-Click Setup and Launcher
color 0B

:: Ensure working directory is the folder where this batch script lives
cd /d "%~dp0"

echo.
echo  ================================================================
echo    PayAgent: Autonomous Agentic Commerce via PayPal Platform
echo  ================================================================
echo.

:: 1. Verify Node.js installation
echo [1/5] Checking Node.js runtime...
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  [X] Node.js is NOT found on this system!
    echo      Please install Node.js v18 or higher from: https://nodejs.org/
    echo      After installing, double-click this file again.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo      Node.js is detected: !NODE_VERSION!

:: 2. Verify npm installation
echo [2/5] Checking npm package manager...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  [X] npm is NOT found! Ensure Node.js is installed with npm included.
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('npm -v') do set NPM_VERSION=%%v
echo      npm is detected: !NPM_VERSION!

:: 3. Setup Environment File (.env)
echo [3/5] Checking environment configuration...
if not exist .env (
    if exist .env.example (
        echo      Generating .env from .env.example...
        copy .env.example .env >nul
    ) else (
        echo      Creating default .env...
        echo PORT=3000 > .env
        echo PAYPAL_CLIENT_ID= >> .env
        echo PAYPAL_CLIENT_SECRET= >> .env
        echo PAYPAL_ENV=sandbox >> .env
        echo USE_SIMULATOR=true >> .env
    )
    echo      .env file created successfully - Interactive Simulator active.
) else (
    echo      .env file verified.
)

:: 4. Verify and Install Node Dependencies
echo [4/5] Checking dependencies express, cors, dotenv...
if not exist node_modules (
    echo      node_modules missing. Installing required packages...
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo.
        echo  [X] Failed to install npm dependencies!
        echo.
        pause
        exit /b 1
    )
    echo      Dependencies installed successfully.
) else (
    echo      Dependencies are already installed.
)

:: 5. Run Verification Test Suite
echo [5/5] Running automated verification test suite...
call npm test
if %errorlevel% neq 0 (
    echo      [!] Warning: Test suite reported an issue, but proceeding to start server...
)

echo.
echo  ================================================================
echo    Setup Complete! Starting PayAgent server...
echo    Opening your web browser at: http://localhost:3000
echo    Press Ctrl+C in this window anytime to stop the server.
echo  ================================================================
echo.

:: Launch default web browser after 2 seconds
start "" cmd /c "powershell -NoProfile -Command Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"

:: Start the application server in the foreground
node server.js

:: If the server exits, keep window open so user can inspect output
echo.
echo Server has stopped.
pause
