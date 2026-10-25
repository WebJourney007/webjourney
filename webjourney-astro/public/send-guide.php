<?php

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=UTF-8');

function sendJsonError($message, $code = 500) {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

try {
    $phpmailer_path = __DIR__ . '/../config/PHPMailer-master/src/Exception.php';
    if (file_exists($phpmailer_path)) {
        require_once __DIR__ . '/../config/PHPMailer-master/src/Exception.php';
        require_once __DIR__ . '/../config/PHPMailer-master/src/PHPMailer.php';
        require_once __DIR__ . '/../config/PHPMailer-master/src/SMTP.php';
    } else {
        sendJsonError('PHPMailer non trouvé dans config/PHPMailer-master/src/');
    }

    $smtp_config_path = __DIR__ . '/../config/smtp.php';
    if (file_exists($smtp_config_path)) {
        $smtp_config = require $smtp_config_path;
    } else {
        sendJsonError('Fichier de configuration SMTP non trouvé (config/smtp.php)');
    }
} catch (Exception $e) {
    sendJsonError('Erreur de configuration serveur');
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$from_email   = $smtp_config['username'] ?? 'hello@webjourney.ch';
$from_name    = 'Web Journey';
$notif_email  = $smtp_config['username'] ?? 'hello@webjourney.ch';

$smtp_host     = $smtp_config['host'] ?? 'mail.infomaniak.com';
$smtp_port     = (int)($smtp_config['port'] ?? 465);
$smtp_username = $smtp_config['username'] ?? '';
$smtp_password = $smtp_config['password'] ?? '';

$smtp_secure = strtolower($smtp_config['secure'] ?? 'ssl');
$smtp_encryption = ($smtp_secure === 'ssl' || $smtp_port === 465)
    ? PHPMailer::ENCRYPTION_SMTPS
    : PHPMailer::ENCRYPTION_STARTTLS;

if (empty($smtp_password)) {
    sendJsonError('Configuration SMTP incomplète. Veuillez vérifier config/smtp.php');
}

// CORS
$allowed_origins = [
    'https://webjourney.ch',
    'https://www.webjourney.ch',
    'http://localhost',
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins) || strpos($origin, 'localhost') !== false) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://webjourney.ch');
}
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Honeypot
$hp_url = isset($_POST['hp_url']) ? trim($_POST['hp_url']) : '';
if ($hp_url !== '') {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Guide envoyé ! Vérifiez votre boîte email.']);
    exit;
}

// Récupération et nettoyage des champs
$firstname = isset($_POST['firstname']) ? htmlspecialchars(trim($_POST['firstname']), ENT_QUOTES, 'UTF-8') : '';
$email     = isset($_POST['email'])     ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : false;

// Validation
$errors = [];
if (empty($firstname) || strlen($firstname) < 2) {
    $errors[] = 'Le prénom est requis (minimum 2 caractères)';
}
if (empty($email) || $email === false) {
    $errors[] = 'L\'adresse email est invalide ou manquante';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Rate limiting : 3 envois max par 5 minutes par IP
$rate_limit_max    = 3;
$rate_limit_window = 300;
$rate_limit_file   = __DIR__ . '/../config/guide_rate_limit.json';
$ip  = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$now = time();

if (is_file($rate_limit_file)) {
    $rl_data = json_decode(file_get_contents($rate_limit_file), true);
} else {
    $rl_data = [];
}
if (!is_array($rl_data)) {
    $rl_data = [];
}
if (!isset($rl_data[$ip])) {
    $rl_data[$ip] = [];
}
$rl_data[$ip] = array_values(array_filter($rl_data[$ip], function ($t) use ($now, $rate_limit_window) {
    return $t > $now - $rate_limit_window;
}));
if (count($rl_data[$ip]) >= $rate_limit_max) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Trop de demandes envoyées. Veuillez réessayer dans 5 minutes.']);
    exit;
}
$rl_data[$ip][] = $now;
$config_dir = dirname($rate_limit_file);
if (is_dir($config_dir) && is_writable($config_dir)) {
    file_put_contents($rate_limit_file, json_encode($rl_data));
}

// Log du lead dans un CSV (hors public)
$leads_file = __DIR__ . '/../config/leads-guide.csv';
$lead_line  = implode(',', [
    date('d/m/Y H:i:s'),
    str_replace(',', ' ', $firstname),
    str_replace(',', ' ', $email),
    $ip
]) . "\n";
if (is_dir(dirname($leads_file)) && is_writable(dirname($leads_file))) {
    file_put_contents($leads_file, $lead_line, FILE_APPEND | LOCK_EX);
}

// Chemin du PDF
$pdf_path = __DIR__ . '/assets/guides/guide-erreurs-site-web.pdf';
$pdf_url  = 'https://www.webjourney.ch/assets/guides/guide-erreurs-site-web.pdf';

// Email HTML au prospect
$prospect_html = '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre guide Web Journey</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,\'Helvetica Neue\',Arial,sans-serif;background:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#f5f5f5;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" style="width:100%;max-width:600px;border-collapse:collapse;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- En-tête sombre -->
          <tr>
            <td style="padding:32px 32px 24px;background:#111;border-radius:8px 8px 0 0;">
              <p style="margin:0 0 20px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#DFA02A;">Web Journey</p>
              <h1 style="margin:0 0 8px;color:#fff;font-size:22px;line-height:1.3;">Votre guide est arrivé, ' . htmlspecialchars($firstname) . ' !</h1>
              <p style="margin:0;color:#999;font-size:14px;font-style:italic;">Les 7 erreurs qui font fuir vos clients sur votre site web</p>
            </td>
          </tr>

          <!-- Corps -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;color:#333;font-size:15px;line-height:1.65;">
                Merci pour votre intérêt ! Vous trouverez votre guide en pièce jointe de cet email.
              </p>
              <p style="margin:0 0 24px;color:#333;font-size:15px;line-height:1.65;">
                En cas de problème, vous pouvez aussi le télécharger directement via ce lien :
              </p>

              <!-- Bouton téléchargement -->
              <table role="presentation" style="margin:0 0 32px;">
                <tr>
                  <td style="background:#DFA02A;border-radius:4px;padding:12px 24px;">
                    <a href="' . $pdf_url . '" style="color:#111;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.05em;">Télécharger le guide →</a>
                  </td>
                </tr>
              </table>

              <!-- Bloc conseil -->
              <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:32px;">
                <tr>
                  <td style="background:#f9f9f7;border-left:3px solid #DFA02A;padding:16px 20px;border-radius:0 4px 4px 0;">
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#DFA02A;font-weight:700;">Astuce</p>
                    <p style="margin:0;color:#444;font-size:14px;line-height:1.6;">
                      Commencez par la <strong>checklist page 10</strong> — elle vous donnera un score immédiat sur l\'état de votre site.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Audit -->
              <table role="presentation" style="width:100%;border-collapse:collapse;background:#111;border-radius:6px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 8px;color:#DFA02A;font-size:15px;font-weight:700;">Votre site fait ces erreurs ?</p>
                    <p style="margin:0 0 16px;color:#ccc;font-size:13px;line-height:1.6;">
                      Nous réalisons gratuitement un audit de votre site sur ces 7 points — en 30 minutes, sans engagement.
                    </p>
                    <a href="https://www.webjourney.ch/demander-un-devis" style="display:inline-block;background:#DFA02A;color:#111;font-size:13px;font-weight:700;padding:10px 20px;border-radius:4px;text-decoration:none;">Demander mon audit gratuit</a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;">
                À très bientôt,<br>
                <strong style="color:#333;">L\'équipe Web Journey</strong><br>
                <a href="mailto:hello@webjourney.ch" style="color:#DFA02A;text-decoration:none;">hello@webjourney.ch</a> · +41 76 844 58 69
              </p>
            </td>
          </tr>

          <!-- Pied -->
          <tr>
            <td style="padding:16px 32px;background:#f9f9f9;border-radius:0 0 8px 8px;text-align:center;">
              <p style="margin:0;color:#bbb;font-size:11px;">
                Web Journey · Rue du Stade 13, 1950 Sion, Suisse ·
                <a href="https://www.webjourney.ch" style="color:#bbb;">webjourney.ch</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

$prospect_text = "Bonjour $firstname,\n\n"
    . "Merci pour votre intérêt ! Votre guide \"Les 7 erreurs qui font fuir vos clients sur votre site\" est en pièce jointe.\n\n"
    . "Vous pouvez aussi le télécharger ici : $pdf_url\n\n"
    . "---\n\n"
    . "Votre site fait ces erreurs ?\n"
    . "Nous réalisons gratuitement un audit de votre site en 30 minutes, sans engagement.\n"
    . "Demandez-le ici : https://www.webjourney.ch/demander-un-devis\n\n"
    . "À très bientôt,\n"
    . "L'équipe Web Journey\n"
    . "hello@webjourney.ch · +41 76 844 58 69";

// Email de notification interne
$date_formatted = date('d/m/Y à H:i:s');
$notif_text = "Nouveau lead — Guide 7 erreurs\n\n"
    . "Prénom : $firstname\n"
    . "Email   : $email\n"
    . "IP      : $ip\n"
    . "Date    : $date_formatted";

try {
    // 1. Email au prospect
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtp_host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp_username;
    $mail->Password   = $smtp_password;
    $mail->SMTPSecure = $smtp_encryption;
    $mail->Port       = $smtp_port;
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64';

    $mail->setFrom($from_email, $from_name);
    $mail->addAddress($email, $firstname);
    $mail->addReplyTo($from_email, $from_name);

    $mail->Subject = 'Votre guide Web Journey — Les 7 erreurs qui font fuir vos clients';
    $mail->Body    = $prospect_html;
    $mail->AltBody = $prospect_text;
    $mail->isHTML(true);

    if (file_exists($pdf_path)) {
        $mail->addAttachment($pdf_path, 'Guide-Web-Journey-7-erreurs.pdf');
    }

    $mail->send();

    // 2. Email de notification interne
    $notif = new PHPMailer(true);
    $notif->isSMTP();
    $notif->Host       = $smtp_host;
    $notif->SMTPAuth   = true;
    $notif->Username   = $smtp_username;
    $notif->Password   = $smtp_password;
    $notif->SMTPSecure = $smtp_encryption;
    $notif->Port       = $smtp_port;
    $notif->CharSet    = 'UTF-8';
    $notif->Encoding   = 'base64';

    $notif->setFrom($from_email, $from_name);
    $notif->addAddress($notif_email, $from_name);

    $notif->Subject = "Nouveau lead — Guide 7 erreurs · $firstname";
    $notif->Body    = '<pre style="font-family:monospace;font-size:14px;">' . htmlspecialchars($notif_text) . '</pre>';
    $notif->AltBody = $notif_text;
    $notif->isHTML(true);

    $notif->send();

    echo json_encode([
        'success' => true,
        'message' => 'Guide envoyé ! Vérifiez votre boîte email.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement à hello@webjourney.ch'
    ]);
}
?>
