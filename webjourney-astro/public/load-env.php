<?php
/**
 * Charge les variables d'environnement depuis le fichier .env
 * Solution simple sans dépendance externe
 */

function loadEnv($path = __DIR__ . '/.env') {
    if (!file_exists($path)) {
        return false;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Ignorer les commentaires
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parser les lignes KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Supprimer les guillemets si présents
            $value = trim($value, '"\'');
            
            // Définir la variable d'environnement si elle n'existe pas déjà
            if (!getenv($key)) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
    
    return true;
}

// Charger automatiquement si appelé directement
if (php_sapi_name() !== 'cli' || !empty($_SERVER['REQUEST_METHOD'])) {
    loadEnv();
}

