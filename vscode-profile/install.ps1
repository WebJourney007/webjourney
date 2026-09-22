# install.ps1 — applique le profil VSCode "Starter" sur cette machine.
# Non destructif : sauvegarde ta config actuelle avant tout écrasement.
# Idempotent : relançable sans risque.
#
# Usage :  pwsh -File install.ps1        (ou clic droit → Exécuter avec PowerShell)

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$userDir = Join-Path $env:APPDATA 'Code\User'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

Write-Host "`n=== Profil VSCode 'Starter' ===" -ForegroundColor Cyan

# 0. VSCode présent ?
if (-not (Get-Command code -ErrorAction SilentlyContinue)) {
	Write-Host "✗ La commande 'code' est introuvable." -ForegroundColor Red
	Write-Host "  Ouvre VSCode → Ctrl+Shift+P → 'Shell Command: Install code command in PATH', puis relance." -ForegroundColor Yellow
	exit 1
}
if (-not (Test-Path $userDir)) { New-Item -ItemType Directory -Force -Path $userDir | Out-Null }

# 1. Extensions
Write-Host "`n[1/3] Installation des extensions..." -ForegroundColor Cyan
$exts = Get-Content (Join-Path $here 'extensions.txt') |
	ForEach-Object { $_.Trim() } |
	Where-Object { $_ -and -not $_.StartsWith('#') }

$ok = 0; $fail = 0
foreach ($ext in $exts) {
	Write-Host "  → $ext"
	try { code --install-extension $ext --force *>$null; $ok++ }
	catch { Write-Host "    ✗ échec : $ext" -ForegroundColor Yellow; $fail++ }
}
Write-Host "  $ok installées, $fail échec(s)." -ForegroundColor Green

# 2. Backup de l'existant
Write-Host "`n[2/3] Sauvegarde de ta config actuelle..." -ForegroundColor Cyan
foreach ($f in @('settings.json', 'keybindings.json')) {
	$target = Join-Path $userDir $f
	if (Test-Path $target) {
		$bak = "$target.backup-$stamp"
		Copy-Item $target $bak
		Write-Host "  ✓ $f → $(Split-Path $bak -Leaf)" -ForegroundColor Green
	} else {
		Write-Host "  · $f absent (rien à sauvegarder)"
	}
}

# 3. Application
Write-Host "`n[3/3] Application des nouveaux fichiers..." -ForegroundColor Cyan
Copy-Item (Join-Path $here 'settings.json')    (Join-Path $userDir 'settings.json')    -Force
Copy-Item (Join-Path $here 'keybindings.json') (Join-Path $userDir 'keybindings.json') -Force
Write-Host "  ✓ settings.json + keybindings.json appliqués." -ForegroundColor Green

Write-Host "`n✅ Terminé. Redémarre VSCode pour tout charger." -ForegroundColor Cyan
Write-Host "   Restauration éventuelle : renomme les fichiers *.backup-$stamp dans" -ForegroundColor DarkGray
Write-Host "   $userDir" -ForegroundColor DarkGray
Write-Host "`n   ⚠ Police : installe 'Fira Code' (gratuite) pour les ligatures." -ForegroundColor Yellow
Write-Host "   ⚠ Thème : 'Monokai Pro' est une extension payante. Sinon le thème" -ForegroundColor Yellow
Write-Host "     gratuit 'Dark Palenight (mkers)' est déjà installé en repli.`n" -ForegroundColor Yellow
