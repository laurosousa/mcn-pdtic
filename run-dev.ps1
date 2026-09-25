# Starts the mcn-pdtic dev server (Vite) locally.
# Usage: .\run-dev.ps1              # default port 21746
#        .\run-dev.ps1 -Port 3000   # custom port
param(
    [int]$Port = 21746,
    [string]$BasePath = "/"
)

$ErrorActionPreference = "Stop"

$artifactDir = Join-Path $PSScriptRoot "artifacts\mcn-pdtic"
$viteJs = Join-Path $artifactDir "node_modules\vite\bin\vite.js"

if (-not (Test-Path $viteJs)) {
    Write-Error "vite.js not found at '$viteJs'. Run 'pnpm install' at the repo root first."
}

# Same values the Replit artifact used (see artifacts/mcn-pdtic/.replit-artifact/artifact.toml).
# Vite is invoked directly via node because pnpm's script shell (Git Bash) mangles BASE_PATH.
$env:PORT = $Port
$env:BASE_PATH = $BasePath

Set-Location $artifactDir
node $viteJs --config vite.config.ts --host localhost
