# check-doc-refs.ps1 — détecte les liens markdown morts dans la doc structurelle.
# Déclenché en PostToolUse (Write|Edit). Ne corrige rien : signale → /sync-docs.
#
# TEST: '{"tool_name":"Edit","tool_input":{"file_path":"<repo>\\docs\\00-index.md"}}' | powershell -NoProfile -File check-doc-refs.ps1
# EXPECT: exit 1 + liste si un lien pointe vers un fichier absent ; sinon exit 0 muet.

$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }

try { $j = $raw | ConvertFrom-Json } catch { exit 0 }

# Racine du repo derivee dynamiquement (aucun chemin hardcode).
$root = (git rev-parse --show-toplevel 2>$null)
if (-not $root) { exit 0 }
$root = $root -replace '/', '\'
$file = "$($j.tool_input.file_path)"
if (-not $file) { exit 0 }

# Chemin relatif au repo, séparateurs normalisés en '/'.
$rel = $file
if ($file.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
    $rel = $file.Substring($root.Length).TrimStart('\', '/')
}
$rel = $rel -replace '\\', '/'

# Filtre de scope : seulement la doc structurelle, jamais les brouillons todo/.
$structurel =
    $rel -match '^docs/.*\.md$' -or
    $rel -eq 'README.md' -or
    $rel -eq 'CLAUDE.md' -or
    $rel -eq 'CONTEXT.md' -or
    $rel -match '^\.claude/skills/.*/SKILL\.md$'
if (-not $structurel) { exit 0 }

# Fichiers à scanner : les prioritaires + celui qu'on vient de modifier.
$cibles = @(
    'README.md',
    'CLAUDE.md',
    'docs/00-index.md',
    'docs/reference/claude-code.md',
    $rel
) | Select-Object -Unique

$morts = [System.Collections.Generic.List[string]]::new()
$linkRegex = '\[[^\]]+\]\(([^)]+)\)'

foreach ($cible in $cibles) {
    $full = Join-Path $root $cible
    if (-not (Test-Path $full)) { continue }

    $dir = Split-Path $full -Parent
    $content = Get-Content $full -Raw
    foreach ($m in [regex]::Matches($content, $linkRegex)) {
        $target = $m.Groups[1].Value.Trim()

        # Couper un éventuel titre : (chemin "Titre").
        $target = ($target -split '\s+')[0]
        # Couper l'ancre : chemin.md#section → chemin.md.
        $target = ($target -split '#')[0]

        if (-not $target) { continue }                       # ancre pure (#...)
        if ($target -match '^(https?:|mailto:)' -or $target -match '://') { continue }  # externe

        # Vivant s'il résout relativement au fichier OU à la racine du repo.
        $okFichier = Test-Path (Join-Path $dir $target)
        $okRacine  = Test-Path (Join-Path $root $target)
        if (-not ($okFichier -or $okRacine)) {
            $morts.Add("  - $cible -> $target (inexistant)")
        }
    }
}

if ($morts.Count -gt 0) {
    $uniq = $morts | Select-Object -Unique
    [Console]::Error.WriteLine("⚠️ $($uniq.Count) référence(s) morte(s) détectée(s) :")
    foreach ($l in $uniq) { [Console]::Error.WriteLine($l) }
    [Console]::Error.WriteLine("→ lance /sync-docs")
    exit 1
}

exit 0
