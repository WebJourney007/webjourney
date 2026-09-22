$json = [Console]::In.ReadToEnd()
try { $j = $json | ConvertFrom-Json } catch { exit 0 }

$cmd = "$($j.tool_input.command)"
if ($cmd -notmatch 'zarchives') { exit 0 }

# Racine du repo derivee dynamiquement (aucun chemin hardcode).
$root = (git rev-parse --show-toplevel 2>$null)
if (-not $root) { exit 0 }
$r = Join-Path $root 'zarchives'
if (-not (Test-Path $r)) { exit 0 }

Get-ChildItem "$r\*.md" | Where-Object {
    (Get-Content $_.FullName -Raw) -notmatch '\| Ouverture \|'
} | ForEach-Object {
    $cr = $_.CreationTime
    $cl = Get-Date
    $lines = Get-Content $_.FullName
    $out = [System.Collections.Generic.List[string]]::new()
    $done = $false
    foreach ($l in $lines) {
        $out.Add($l)
        if (-not $done -and $l -match '^#') {
            $out.Add('')
            $out.Add("| Ouverture | $($cr.ToString('yyyy-MM-dd')) | $($cr.ToString('HH:mm')) |")
            $out.Add("| Clôture   | $($cl.ToString('yyyy-MM-dd')) | $($cl.ToString('HH:mm')) |")
            $done = $true
        }
    }
    $out | Set-Content $_.FullName -Encoding UTF8
}
exit 0
