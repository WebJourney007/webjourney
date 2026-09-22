<?php
require_once __DIR__ . '/../load-env.php';
loadEnv(__DIR__ . '/../.env');

// ── Sécurité ──────────────────────────────────────────────────────────────────
$token = $_GET['token'] ?? '';
if ($token !== getenv('SEND_TOKEN')) {
    http_response_code(403);
    echo '403 — Accès refusé.';
    exit;
}

$notion_key = getenv('NOTION_API_KEY');
$notion_db  = getenv('NOTION_PROSPECTS_DB');

function notion_request(string $method, string $endpoint, ?array $body = null): ?array {
    global $notion_key;
    $ch = curl_init("https://api.notion.com/v1/{$endpoint}");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer {$notion_key}",
        "Content-Type: application/json",
        "Notion-Version: 2022-06-28",
    ]);
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $r = curl_exec($ch);
    curl_close($ch);
    return $r ? json_decode($r, true) : null;
}

// ── Récupérer tous les prospects ──────────────────────────────────────────────
$result = notion_request('POST', "databases/{$notion_db}/query", [
    'sorts' => [['property' => 'Date contact', 'direction' => 'descending']],
]);
$prospects = $result['results'] ?? [];

// ── Helpers ───────────────────────────────────────────────────────────────────
function statut_badge(string $statut): string {
    $colors = [
        'À appeler'              => '#888',
        'Appelé - pas intéressé' => '#e74c3c',
        'Appelé - mail à envoyer'=> '#e67e22',
        'Mail envoyé'            => '#3498db',
        'Audit demandé'          => '#9b59b6',
        'Devis envoyé'           => '#8e44ad',
        'Signé'                  => '#27ae60',
    ];
    $color = $colors[$statut] ?? '#aaa';
    return "<span style='background:{$color};color:#fff;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap'>" . htmlspecialchars($statut) . "</span>";
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Prospects — Web Journey</title>
  <meta name="robots" content="noindex, nofollow">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; color: #090909; }
    header { background: #090909; color: #fff; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; }
    header h1 { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
    header span { font-size: 13px; color: #aaa; }
    .container { max-width: 1100px; margin: 32px auto; padding: 0 24px; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
    thead { background: #090909; color: #fff; }
    th { padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
    td { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafafa; }
    .slug { font-family: monospace; font-size: 12px; color: #666; }
    .email { color: #444; font-size: 13px; }
    .no-email { color: #bbb; font-size: 12px; font-style: italic; }
    .btn-send { background: #090909; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .btn-send:hover { background: #333; }
    .btn-sent { background: #eee; color: #aaa; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; cursor: default; white-space: nowrap; }
    .btn-preview { background: transparent; border: 1px solid #ddd; color: #666; padding: 8px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; text-decoration: none; margin-right: 6px; }
    .btn-preview:hover { border-color: #090909; color: #090909; }
    .actions { display: flex; align-items: center; gap: 6px; }
    .empty { text-align: center; padding: 48px; color: #aaa; }
    .toast { position: fixed; bottom: 24px; right: 24px; background: #090909; color: #fff; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; display: none; z-index: 999; }
    .toast.error { background: #e74c3c; }
  </style>
</head>
<body>

<header>
  <h1>web journey — Prospects</h1>
  <span><?= count($prospects) ?> prospect<?= count($prospects) > 1 ? 's' : '' ?></span>
</header>

<div class="container">
  <?php if (empty($prospects)): ?>
    <p class="empty">Aucun prospect dans la base.</p>
  <?php else: ?>
  <table>
    <thead>
      <tr>
        <th>Client / Entreprise</th>
        <th>Slug</th>
        <th>Email</th>
        <th>Statut</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($prospects as $p):
        $props         = $p['properties'];
        $nom_client    = $props['Nom client']['title'][0]['plain_text'] ?? '';
        $nom_entreprise = $props['Nom entreprise']['rich_text'][0]['plain_text'] ?? '';
        $nom_display   = $nom_entreprise ?: $nom_client ?: '—';
        $slug          = $props['Slug']['rich_text'][0]['plain_text'] ?? '';
        $email         = $props['Email']['email'] ?? '';
        $statut        = $props['Statut']['select']['name'] ?? '—';
        $deja_envoye   = $statut === 'Mail envoyé' || $statut === 'Audit demandé' || $statut === 'Devis envoyé' || $statut === 'Signé';
        $send_url      = "send-prospect.php?slug=" . urlencode($slug) . "&token=" . urlencode($token);
        $preview_url   = "https://www.webjourney.ch/offre/?slug=" . urlencode($slug);
      ?>
      <tr>
        <td><strong><?= htmlspecialchars($nom_display) ?></strong>
          <?php if ($nom_entreprise && $nom_client): ?>
            <br><span style="color:#888;font-size:12px"><?= htmlspecialchars($nom_client) ?></span>
          <?php endif ?>
        </td>
        <td class="slug"><?= htmlspecialchars($slug) ?: '<span style="color:#bbb">—</span>' ?></td>
        <td><?php if ($email): ?>
          <span class="email"><?= htmlspecialchars($email) ?></span>
        <?php else: ?>
          <span class="no-email">pas d'email</span>
        <?php endif ?></td>
        <td><?= statut_badge($statut) ?></td>
        <td>
          <div class="actions">
            <?php if ($slug): ?>
              <a href="<?= htmlspecialchars($preview_url) ?>" target="_blank" class="btn-preview">Voir la page</a>
            <?php endif ?>
            <?php if (!$email || !$slug): ?>
              <button class="btn-sent" disabled title="Email ou slug manquant">Envoyer</button>
            <?php elseif ($deja_envoye): ?>
              <button class="btn-sent" disabled>✓ Envoyé</button>
            <?php else: ?>
              <button class="btn-send" onclick="sendMail(this, '<?= htmlspecialchars($slug) ?>')">Envoyer le mail</button>
            <?php endif ?>
          </div>
        </td>
      </tr>
      <?php endforeach ?>
    </tbody>
  </table>
  <?php endif ?>
</div>

<div class="toast" id="toast"></div>

<script>
const TOKEN = '<?= htmlspecialchars($token) ?>';

async function sendMail(btn, slug) {
  btn.disabled = true;
  btn.textContent = 'Envoi…';
  try {
    const r = await fetch(`send-prospect.php?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(TOKEN)}`);
    const text = await r.text();
    if (r.ok) {
      btn.className = 'btn-sent';
      btn.textContent = '✓ Envoyé';
      showToast('Mail envoyé !');
    } else {
      btn.disabled = false;
      btn.textContent = 'Envoyer le mail';
      showToast(text, true);
    }
  } catch(e) {
    btn.disabled = false;
    btn.textContent = 'Envoyer le mail';
    showToast('Erreur réseau', true);
  }
}

function showToast(msg, error = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (error ? ' error' : '');
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 3500);
}
</script>

</body>
</html>
