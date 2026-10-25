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

$to_email = $smtp_config['username'] ?? 'hello@webjourney.ch';
$from_email = $smtp_config['username'] ?? 'hello@webjourney.ch';
$from_name = 'Web Journey';
$site_name = 'Web Journey';

$smtp_host = $smtp_config['host'] ?? 'mail.infomaniak.com';
$smtp_port = (int)($smtp_config['port'] ?? 465);
$smtp_username = $smtp_config['username'] ?? '';
$smtp_password = $smtp_config['password'] ?? '';

$smtp_secure = strtolower($smtp_config['secure'] ?? 'ssl');
if ($smtp_secure === 'ssl' || $smtp_port === 465) {
    $smtp_encryption = PHPMailer::ENCRYPTION_SMTPS;
} else {
    $smtp_encryption = PHPMailer::ENCRYPTION_STARTTLS;
}

if (empty($smtp_password)) {

    sendJsonError('Configuration SMTP incomplète. Veuillez vérifier config/smtp.php');
}

$allowed_origins = [
    'https://webjourney.ch',
    'https://www.webjourney.ch',
    'http://localhost',
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins) || (strpos($origin, 'localhost') !== false)) {
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

// Honeypot anti-spam : si le champ caché est rempli, on rejette silencieusement
$hp_url = isset($_POST['hp_url']) ? trim($_POST['hp_url']) : '';
if ($hp_url !== '') {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès ! Nous vous répondrons rapidement.']);
    exit;
}

$is_devis = isset($_POST['firstname']) || isset($_POST['lastname']);
$name = '';
$email = '';
$phone = '';
$message = '';

if ($is_devis) {
    $firstname = isset($_POST['firstname']) ? htmlspecialchars(trim($_POST['firstname']), ENT_QUOTES, 'UTF-8') : '';
    $lastname = isset($_POST['lastname']) ? htmlspecialchars(trim($_POST['lastname']), ENT_QUOTES, 'UTF-8') : '';
    $name = trim($firstname . ' ' . $lastname);
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8') : '';
    $company_description = isset($_POST['company_description']) ? strip_tags(trim($_POST['company_description'])) : '';
    $project_description = isset($_POST['project_description']) ? strip_tags(trim($_POST['project_description'])) : '';
    $website = isset($_POST['website']) ? htmlspecialchars(trim($_POST['website']), ENT_QUOTES, 'UTF-8') : '';
    $site_problem = isset($_POST['site_problem']) ? $_POST['site_problem'] : '';
    $revenue = isset($_POST['revenue']) ? $_POST['revenue'] : '';
    $message = "Demande de devis\n\n";
    $message .= "Entreprise / description :\n" . $company_description . "\n\n";
    $message .= "Projet / besoin :\n" . $project_description . "\n\n";
    $message .= "Site internet : " . ($website ?: 'Non renseigné') . "\n";
    $message .= "Problème principal : " . $site_problem . "\n";
    $message .= "CA mensuel : " . $revenue . "\n";
} else {
    $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8') : '';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';
}

$errors = [];
if (empty($name) || strlen($name) < 2) {
    $errors[] = $is_devis ? 'Prénom et nom sont requis (minimum 2 caractères)' : 'Le nom est requis (minimum 2 caractères)';
}
if (empty($email) || $email === false) {
    $errors[] = 'L\'email est requis ou invalide';
}
if (empty($phone)) {
    $errors[] = 'Le numéro de téléphone est requis';
} else {
    $phone_digits = preg_replace('/[^0-9]/', '', $phone);
    $len = strlen($phone_digits);
    $valid_phone = ($len === 10 && $phone_digits[0] === '0')
        || ($len === 11 && substr($phone_digits, 0, 2) === '41');
    if (!$valid_phone) {
        $errors[] = 'Le numéro de téléphone doit compter 10 chiffres au format suisse (ex. 076 543 21 00) ou 11 chiffres avec indicatif +41.';
    }
}
if (empty($message) || strlen($message) < 10) {
    $errors[] = $is_devis ? 'La description de votre entreprise est requise' : 'Le message est requis (minimum 10 caractères)';
}

if ($is_devis && empty($errors)) {
    if (empty(trim($company_description ?? '')) || strlen(trim($company_description ?? '')) < 10) {
        $errors[] = 'Décrivez brièvement votre entreprise (minimum 10 caractères)';
    }
    if (empty(trim($project_description ?? '')) || strlen(trim($project_description ?? '')) < 10) {
        $errors[] = 'Décrivez votre projet (minimum 10 caractères)';
    }
}

$spam_patterns = ['http://', 'https://'];
$message_lower = strtolower($message);
$spam_detected = false;
if (strlen($message) > 0) {
    foreach ($spam_patterns as $pattern) {
        if (strpos($message_lower, $pattern) !== false && strlen($message) < 50) {
            $spam_detected = true;
            break;
        }
    }
}
if ($spam_detected) {
    $errors[] = 'Le message contient des éléments suspects';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Limite : 3 envois par heure par IP
$rate_limit_max = 3;
$rate_limit_window = 300; // 5 minutes en secondes
$rate_limit_file = __DIR__ . '/../config/form_rate_limit.json';
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$now = time();

if (is_file($rate_limit_file)) {
    $data = json_decode(file_get_contents($rate_limit_file), true);
} else {
    $data = [];
}
if (!is_array($data)) {
    $data = [];
}
if (!isset($data[$ip])) {
    $data[$ip] = [];
}
$data[$ip] = array_values(array_filter($data[$ip], function ($t) use ($now, $rate_limit_window) {
    return $t > $now - $rate_limit_window;
}));
if (count($data[$ip]) >= $rate_limit_max) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Trop de demandes envoyées. Veuillez réessayer dans 5 minutes.']);
    exit;
}
$data[$ip][] = $now;
$config_dir = dirname($rate_limit_file);
if (is_dir($config_dir) && is_writable($config_dir)) {
    file_put_contents($rate_limit_file, json_encode($data));
}

try {

    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = $smtp_host;
    $mail->SMTPAuth = true;
    $mail->Username = $smtp_username;
    $mail->Password = $smtp_password;
    $mail->SMTPSecure = $smtp_encryption;
    $mail->Port = $smtp_port;

    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    $mail->setFrom($from_email, $from_name);
    $mail->addAddress($to_email);
    $mail->addReplyTo($email, $name);

    $subject_name = preg_replace('/[\r\n]/', '', $name);
    $subject = $is_devis
        ? "Demande de devis de $subject_name - $site_name"
        : "Nouveau message de $subject_name - $site_name";

    $intro = $is_devis
        ? "Vous avez reçu une demande de devis depuis le formulaire de $site_name.\n\n"
        : "Vous avez reçu un nouveau message depuis le formulaire de contact de $site_name.\n\n";
    $email_body_text = $intro;
    $email_body_text .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $email_body_text .= "Nom: $name\n";
    $email_body_text .= "Email: $email\n";
    $email_body_text .= "Téléphone: " . ($phone ? $phone : 'Non renseigné') . "\n\n";
    $email_body_text .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $email_body_text .= "Message:\n\n$message\n\n";
    $email_body_text .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
    $email_body_text .= "Date: " . date('d/m/Y à H:i:s') . "\n";

    $phone_display = $phone ? htmlspecialchars($phone) : '<em>Non renseigné</em>';
    $message_html = nl2br(htmlspecialchars($message));
    $date_formatted = date('d/m/Y à H:i:s');

    $email_body_html = '
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message - ' . htmlspecialchars($site_name) . '</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; background-color: #090909; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Nouveau message</h1>
                            <p style="margin: 8px 0 0 0; color: #f5f5f5; font-size: 14px;">Formulaire de contact - ' . htmlspecialchars($site_name) . '</p>
                        </td>
                    </tr>

                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 30px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.5;">
                                Vous avez reçu un nouveau message depuis le formulaire de contact.
                            </p>

                            <!-- Informations du contact -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                                        <strong style="color: #090909; font-size: 14px; display: inline-block; width: 120px;">Nom:</strong>
                                        <span style="color: #333333; font-size: 14px;">' . htmlspecialchars($name) . '</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                                        <strong style="color: #090909; font-size: 14px; display: inline-block; width: 120px;">Email:</strong>
                                        <a href="mailto:' . htmlspecialchars($email) . '" style="color: #0066cc; text-decoration: none; font-size: 14px;">' . htmlspecialchars($email) . '</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                                        <strong style="color: #090909; font-size: 14px; display: inline-block; width: 120px;">Téléphone:</strong>
                                        <span style="color: #333333; font-size: 14px;">' . $phone_display . '</span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Message -->
                            <div style="background-color: #f9f9f9; border-left: 4px solid #090909; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                                <h2 style="margin: 0 0 15px 0; color: #090909; font-size: 18px; font-weight: 600;">Message</h2>
                                <div style="color: #333333; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">' . $message_html . '</div>
                            </div>

                            <!-- Footer -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; border-top: 1px solid #e5e5e5; padding-top: 20px;">
                                <tr>
                                    <td style="padding: 0;">
                                        <p style="margin: 0; color: #666666; font-size: 12px; line-height: 1.5;">
                                            Date de réception: <strong>' . htmlspecialchars($date_formatted) . '</strong><br>
                                            IP: ' . htmlspecialchars($_SERVER['REMOTE_ADDR'] ?? 'Non disponible') . '
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer bas -->
                    <tr>
                        <td style="padding: 20px 30px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                Ce message a été envoyé depuis le formulaire de contact de <strong>' . htmlspecialchars($site_name) . '</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

    $mail->Subject = $subject;
    $mail->Body = $email_body_html;
    $mail->AltBody = $email_body_text;
    $mail->isHTML(true);

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => $is_devis
            ? 'Demande envoyée avec succès ! Nous vous recontacterons rapidement.'
            : 'Message envoyé avec succès ! Nous vous répondrons rapidement.'
    ]);

} catch (Exception $e) {

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.'
    ]);

}
?>
