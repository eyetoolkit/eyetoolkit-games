# Zeli Web Games — one-file launcher for Windows PowerShell
# Usage: powershell -ExecutionPolicy Bypass -File .\run.ps1
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is required but was not found." -ForegroundColor Red
    Write-Host "Install the LTS version from https://nodejs.org and run this script again."
    exit 1
}

Write-Host "Node $(node --version) / npm $(npm --version) detected." -ForegroundColor Green

if (-not (Test-Path (Join-Path $PSScriptRoot "node_modules"))) {
    Write-Host "Installing dependencies (first run only)..." -ForegroundColor Cyan
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed." -ForegroundColor Red; exit 1 }
}

Write-Host "Starting the game browser (Ctrl+C to stop)..." -ForegroundColor Cyan
npm run dev -- --open
