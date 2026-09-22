<?php

header('Content-Type: application/json; charset=UTF-8');

$allowed_origins = ['https://webjourney.ch', 'https://www.webjourney.ch', 'http://localhost'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins) || strpos($origin, 'localhost') !== false) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://webjourney.ch');
}
header('Access-Control-Allow-Methods: GET');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

$url      = isset($_GET['url'])      ? trim($_GET['url'])      : '';
$strategy = isset($_GET['strategy']) && $_GET['strategy'] === 'desktop' ? 'desktop' : 'mobile';

if (empty($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['error' => 'URL invalide']);
    exit;
}

// URL du service Vercel — à mettre à jour avec ton URL Vercel réelle
$vercel_url = 'https://webjourney-007.vercel.app/api/audit'
    . '?url=' . urlencode($url)
    . '&strategy=' . urlencode($strategy);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL            => $vercel_url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 65,
    CURLOPT_USERAGENT      => 'WJ-AuditProxy/1.0',
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response    = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $http_status === 0) {
    http_response_code(502);
    echo json_encode(['error' => 'Service d\'analyse indisponible']);
    exit;
}

http_response_code($http_status);
echo $response;
?>
