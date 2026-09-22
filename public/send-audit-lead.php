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
        sendJsonError('PHPMailer non trouvé');
    }

    $smtp_config_path = __DIR__ . '/../config/smtp.php';
    if (file_exists($smtp_config_path)) {
        $smtp_config = require $smtp_config_path;
    } else {
        sendJsonError('Configuration SMTP manquante');
    }
} catch (Exception $e) {
    sendJsonError('Erreur de configuration serveur');
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$smtp_host     = $smtp_config['host']     ?? 'mail.infomaniak.com';
$smtp_port     = (int)($smtp_config['port'] ?? 465);
$smtp_username = $smtp_config['username'] ?? '';
$smtp_password = $smtp_config['password'] ?? '';
$smtp_secure   = strtolower($smtp_config['secure'] ?? 'ssl');
$smtp_encryption = ($smtp_secure === 'ssl' || $smtp_port === 465)
    ? PHPMailer::ENCRYPTION_SMTPS
    : PHPMailer::ENCRYPTION_STARTTLS;

$to_email   = $smtp_config['username'] ?? 'hello@webjourney.ch';
$from_email = $smtp_config['username'] ?? 'hello@webjourney.ch';

$allowed_origins = ['https://webjourney.ch', 'https://www.webjourney.ch', 'http://localhost'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
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

$email      = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : '';
$audited_url = isset($_POST['url']) ? htmlspecialchars(trim($_POST['url']), ENT_QUOTES, 'UTF-8') : '';
$score_perf  = isset($_POST['score_perf'])  ? (int)$_POST['score_perf']  : 0;
$score_seo   = isset($_POST['score_seo'])   ? (int)$_POST['score_seo']   : 0;
$score_a11y  = isset($_POST['score_a11y'])  ? (int)$_POST['score_a11y']  : 0;
$score_bp    = isset($_POST['score_bp'])    ? (int)$_POST['score_bp']    : 0;

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}
if (empty($audited_url)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'URL manquante']);
    exit;
}

function scoreColor($score) {
    if ($score >= 90) return '#0cce6b';
    if ($score >= 50) return '#ffa400';
    return '#ff4e42';
}

function scoreLabel($score) {
    if ($score >= 90) return 'Bon';
    if ($score >= 50) return 'À améliorer';
    return 'Faible';
}

$date = date('d/m/Y à H:i:s');
$ip   = $_SERVER['REMOTE_ADDR'] ?? 'Non disponible';

$email_body_html = '
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Nouveau lead audit — Web Journey</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;background:#f5f5f5;">
  <table role="presentation" style="width:100%;background:#f5f5f5;padding:20px 0;">
    <tr><td align="center">
      <table role="presentation" style="width:100%;max-width:600px;background:#fff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,.1);">

        <tr>
          <td style="padding:30px;background:#090909;border-radius:8px 8px 0 0;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:600;">Nouveau lead — Outil Audit</h1>
            <p style="margin:8px 0 0;color:#aaa;font-size:14px;">Web Journey · ' . htmlspecialchars($date) . '</p>
          </td>
        </tr>

        <tr>
          <td style="padding:30px;">

            <table role="presentation" style="width:100%;margin-bottom:24px;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;">
                  <strong style="color:#090909;width:120px;display:inline-block;font-size:14px;">Email :</strong>
                  <a href="mailto:' . htmlspecialchars($email) . '" style="color:#0066cc;font-size:14px;">' . htmlspecialchars($email) . '</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e5e5;">
                  <strong style="color:#090909;width:120px;display:inline-block;font-size:14px;">URL auditée :</strong>
                  <a href="' . htmlspecialchars($audited_url) . '" style="color:#0066cc;font-size:14px;">' . htmlspecialchars($audited_url) . '</a>
                </td>
              </tr>
            </table>

            <h2 style="margin:0 0 16px;color:#090909;font-size:16px;">Scores Lighthouse</h2>
            <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr>
                <td style="padding:8px 12px;background:' . scoreColor($score_perf) . '20;border-radius:6px;margin-bottom:8px;">
                  <strong style="color:#090909;font-size:14px;">Performance</strong>
                  <span style="float:right;font-size:18px;font-weight:700;color:' . scoreColor($score_perf) . ';">' . $score_perf . '/100</span>
                  <br><span style="font-size:12px;color:#666;">' . scoreLabel($score_perf) . '</span>
                </td>
              </tr>
              <tr><td style="height:6px;"></td></tr>
              <tr>
                <td style="padding:8px 12px;background:' . scoreColor($score_seo) . '20;border-radius:6px;">
                  <strong style="color:#090909;font-size:14px;">SEO</strong>
                  <span style="float:right;font-size:18px;font-weight:700;color:' . scoreColor($score_seo) . ';">' . $score_seo . '/100</span>
                  <br><span style="font-size:12px;color:#666;">' . scoreLabel($score_seo) . '</span>
                </td>
              </tr>
              <tr><td style="height:6px;"></td></tr>
              <tr>
                <td style="padding:8px 12px;background:' . scoreColor($score_a11y) . '20;border-radius:6px;">
                  <strong style="color:#090909;font-size:14px;">Accessibilité</strong>
                  <span style="float:right;font-size:18px;font-weight:700;color:' . scoreColor($score_a11y) . ';">' . $score_a11y . '/100</span>
                  <br><span style="font-size:12px;color:#666;">' . scoreLabel($score_a11y) . '</span>
                </td>
              </tr>
              <tr><td style="height:6px;"></td></tr>
              <tr>
                <td style="padding:8px 12px;background:' . scoreColor($score_bp) . '20;border-radius:6px;">
                  <strong style="color:#090909;font-size:14px;">Bonnes pratiques</strong>
                  <span style="float:right;font-size:18px;font-weight:700;color:' . scoreColor($score_bp) . ';">' . $score_bp . '/100</span>
                  <br><span style="font-size:12px;color:#666;">' . scoreLabel($score_bp) . '</span>
                </td>
              </tr>
            </table>

            <p style="margin:0;color:#999;font-size:12px;">IP : ' . htmlspecialchars($ip) . '</p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 30px;background:#f9f9f9;border-radius:0 0 8px 8px;text-align:center;">
            <p style="margin:0;color:#999;font-size:12px;">Lead généré depuis l\'outil d\'audit de <strong>webjourney.ch</strong></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>';

$email_body_text = "Nouveau lead — Outil Audit Web Journey\n\n";
$email_body_text .= "Email : $email\n";
$email_body_text .= "URL auditée : $audited_url\n\n";
$email_body_text .= "Scores :\n";
$email_body_text .= "Performance : $score_perf/100\n";
$email_body_text .= "SEO : $score_seo/100\n";
$email_body_text .= "Accessibilité : $score_a11y/100\n";
$email_body_text .= "Bonnes pratiques : $score_bp/100\n\n";
$email_body_text .= "Date : $date\nIP : $ip";

try {
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

    $mail->setFrom($from_email, 'Web Journey');
    $mail->addAddress($to_email);
    $mail->addReplyTo($email, $email);

    $mail->Subject = "Nouveau lead audit — $audited_url";
    $mail->isHTML(true);
    $mail->Body    = $email_body_html;
    $mail->AltBody = $email_body_text;

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Rapport envoyé !']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi.']);
}
?>
