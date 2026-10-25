<?php
require_once __DIR__ . '/../load-env.php';
loadEnv(__DIR__ . '/../.env');

// ── Sécurité ─────────────────────────────────────────────────────────────────
$token = $_GET['token'] ?? '';
if ($token !== getenv('SEND_TOKEN')) {
    http_response_code(403);
    echo 'Accès refusé.';
    exit;
}

$slug = trim(preg_replace('/[^a-z0-9\-]/', '', strtolower($_GET['slug'] ?? '')));
if (empty($slug)) {
    http_response_code(400);
    echo 'Slug manquant.';
    exit;
}

// ── Notion API ────────────────────────────────────────────────────────────────
$notion_key = getenv('NOTION_API_KEY');
$notion_db  = getenv('NOTION_PROSPECTS_DB');

function notion_request(string $method, string $endpoint, ?array $body = null): ?array {
    global $notion_key;
    $ch = curl_init("https://api.notion.com/v1/{$endpoint}");
    $headers = [
        "Authorization: Bearer {$notion_key}",
        "Content-Type: application/json",
        "Notion-Version: 2022-06-28",
    ];
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    } elseif ($method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $response = curl_exec($ch);
    curl_close($ch);
    return $response ? json_decode($response, true) : null;
}

$result = notion_request('POST', "databases/{$notion_db}/query", [
    'filter' => [
        'property' => 'Slug',
        'rich_text' => ['equals' => $slug],
    ],
]);

if (empty($result['results'])) {
    http_response_code(404);
    echo "Prospect introuvable pour le slug : {$slug}";
    exit;
}

$page    = $result['results'][0];
$page_id = $page['id'];
$props   = $page['properties'];

$nom_client    = $props['Nom client']['title'][0]['plain_text'] ?? '';
$nom_entreprise = $props['Nom entreprise']['rich_text'][0]['plain_text'] ?? '';
$email_prospect = $props['Email']['email'] ?? '';

if (empty($email_prospect)) {
    http_response_code(400);
    echo "Aucune adresse email pour ce prospect. Renseigne le champ Email dans Notion.";
    exit;
}

$landing_url = "https://www.webjourney.ch/offre/?slug=" . urlencode($slug);
$salutation  = !empty($nom_client) ? "Bonjour {$nom_client}," : "Bonjour,";
$nom_display = $nom_entreprise ?: $nom_client ?: 'votre activité';

// ── PHPMailer ─────────────────────────────────────────────────────────────────
require_once __DIR__ . '/../../config/PHPMailer-master/src/Exception.php';
require_once __DIR__ . '/../../config/PHPMailer-master/src/PHPMailer.php';
require_once __DIR__ . '/../../config/PHPMailer-master/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$smtp = require __DIR__ . '/../../config/smtp.php';

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtp['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp['username'];
    $mail->Password   = $smtp['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $smtp['port'];
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64';

    $mail->setFrom('hello@webjourney.ch', 'Maxime — Web Journey');
    $mail->addAddress($email_prospect);
    $mail->Subject = "J'ai analysé votre site — {$nom_display}";

    $mail->isHTML(true);
    $unsubscribe_url = "https://www.webjourney.ch/offre/?slug=" . urlencode($slug) . "&action=not-interested";
    $mail->Body    = email_html($salutation, $nom_display, $landing_url, $unsubscribe_url);
    $mail->AltBody = email_text($salutation, $landing_url, $unsubscribe_url);

    $mail->send();

    // Mettre à jour le statut Notion → Mail envoyé
    notion_request('PATCH', "pages/{$page_id}", [
        'properties' => [
            'Statut' => ['select' => ['name' => 'Mail envoyé']],
        ],
    ]);

    echo "✅ Mail envoyé à {$email_prospect} — statut Notion mis à jour.";

} catch (Exception $e) {
    http_response_code(500);
    echo "Erreur d'envoi : " . $mail->ErrorInfo;
}

// ── Templates email ───────────────────────────────────────────────────────────
function email_html(string $salutation, string $nom_display, string $landing_url, string $unsubscribe_url): string {
    $url_safe         = htmlspecialchars($landing_url, ENT_QUOTES, 'UTF-8');
    $unsubscribe_safe = htmlspecialchars($unsubscribe_url, ENT_QUOTES, 'UTF-8');
    return <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Web Journey</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" style="width:100%;border-collapse:collapse;background-color:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" style="width:100%;max-width:580px;border-collapse:collapse;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.08);background-image:url('https://www.webjourney.ch/assets/images/trace-20%.png');background-repeat:no-repeat;background-position:center center;background-size:90% auto;">

          <!-- Logo -->
          <tr>
            <td style="padding:36px 40px 0;text-align:left;">
              <a href="https://www.webjourney.ch" style="text-decoration:none;">
                <img src="https://www.webjourney.ch/assets/images/logo-flat-WebJourney.png" alt="Web Journey" height="36" style="display:inline-block;height:36px;width:auto;">
              </a>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding:32px 40px 32px;">
              <p style="margin:0 0 24px;color:#090909;font-size:16px;line-height:1.6;font-weight:600;">{$salutation}</p>
              <p style="margin:0 0 20px;color:#333333;font-size:15px;line-height:1.7;">
                J'ai pris le temps d'analyser la présence en ligne de <strong style="color:#090909;">{$nom_display}</strong> et j'ai quelque chose de concret à vous montrer.
              </p>
              <p style="margin:0 0 36px;color:#333333;font-size:15px;line-height:1.7;">
                J'ai préparé une courte vidéo d'analyse ainsi qu'une proposition sur mesure — ça prend 3 minutes à regarder.
              </p>

              <!-- CTA -->
              <table role="presentation" style="border-collapse:collapse;margin-bottom:36px;">
                <tr>
                  <td style="background-color:#090909;border-radius:6px;padding:16px 32px;">
                    <a href="{$url_safe}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:-0.01em;">
                      Voir mon analyse personnalisée &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#999999;font-size:12px;line-height:1.6;">
                Lien direct : <a href="{$url_safe}" style="color:#666666;word-break:break-all;">{$url_safe}</a>
              </p>
            </td>
          </tr>

          <!-- Signature + footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #eeeeee;">
              <p style="margin:0;color:#090909;font-size:15px;font-weight:700;">Maxime Berton</p>
              <p style="margin:2px 0 8px;color:#888888;font-size:13px;">Fondateur — Web Journey</p>
              <p style="margin:0 0 16px;color:#666666;font-size:13px;"><a href="mailto:hello@webjourney.ch" style="color:#090909;text-decoration:none;">hello@webjourney.ch</a> &nbsp;·&nbsp; <a href="https://wa.me/41768445869" style="color:#090909;text-decoration:none;">+41 76 844 58 69</a></p>
              <p style="margin:0;color:#bbbbbb;font-size:11px;">
                Vous ne souhaitez pas être recontacté ?
                <a href="{$unsubscribe_safe}" style="color:#aaaaaa;">Cliquez ici</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

function email_text(string $salutation, string $landing_url, string $unsubscribe_url): string {
    return "{$salutation}\n\nJ'ai analysé votre présence en ligne et préparé une courte vidéo avec une proposition concrète.\n\nVoir votre analyse : {$landing_url}\n\n---\nMaxime — Web Journey\nhello@webjourney.ch\n+41 76 844 58 69\n\nPas intéressé ? {$unsubscribe_url}";
}
