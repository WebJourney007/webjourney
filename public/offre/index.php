<?php
require_once __DIR__ . '/../load-env.php';
loadEnv(__DIR__ . '/../.env');

$slug = trim(preg_replace('/[^a-z0-9\-]/', '', strtolower($_GET['slug'] ?? '')));

if (empty($slug)) {
    header('Location: https://www.webjourney.ch/');
    exit;
}

// ── Notion API ─────────────────────────────────────────────────────────────
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

// Rechercher le prospect par slug
$result = notion_request('POST', "databases/{$notion_db}/query", [
    'filter' => [
        'property' => 'Slug',
        'rich_text' => ['equals' => $slug],
    ],
]);

// Debug : lister toutes les entrées sans filtre
if (isset($_GET['debug']) && $_GET['debug'] === 'wj2025') {
    $all = notion_request('POST', "databases/{$notion_db}/query", []);
    header('Content-Type: application/json');
    echo json_encode([
        'slug_searched' => $slug,
        'filtered_results' => $result,
        'all_entries' => array_map(fn($p) => [
            'id'   => $p['id'],
            'nom'  => $p['properties']['Nom client']['title'][0]['plain_text'] ?? '?',
            'slug' => $p['properties']['Slug']['rich_text'][0]['plain_text'] ?? '(vide)',
        ], $all['results'] ?? []),
    ]);
    exit;
}

if (empty($result['results'])) {
    // Debug temporaire — à retirer après diagnostic
    if (isset($_GET['debug']) && $_GET['debug'] === 'wj2025') {
        header('Content-Type: application/json');
        echo json_encode([
            'slug'       => $slug,
            'notion_key' => $notion_key ? substr($notion_key, 0, 8) . '...' : 'MANQUANT',
            'notion_db'  => $notion_db ?: 'MANQUANT',
            'result'     => $result,
        ]);
        exit;
    }
    header('Location: https://www.webjourney.ch/');
    exit;
}

$page      = $result['results'][0];
$page_id   = $page['id'];
$props     = $page['properties'];

$nom_client   = $props['Nom client']['title'][0]['plain_text'] ?? '';
$nom_entreprise = $props['Nom entreprise']['rich_text'][0]['plain_text'] ?? '';
$loom_url     = $props['Vidéo Loom']['url'] ?? '';
$secteur      = $props['Secteur']['select']['name'] ?? '';

// Marquer "Landing page vue" = true (tracking automatique)
notion_request('PATCH', "pages/{$page_id}", [
    'properties' => [
        'Landing page vue' => ['checkbox' => true],
    ],
]);

// Action : prospect pas intéressé
if (($_GET['action'] ?? '') === 'not-interested') {
    notion_request('PATCH', "pages/{$page_id}", [
        'properties' => [
            'Statut' => ['select' => ['name' => 'Appelé - pas intéressé']],
        ],
    ]);
    $nom_safe_tmp = htmlspecialchars($props['Nom client']['title'][0]['plain_text'] ?? '', ENT_QUOTES, 'UTF-8');
    ?><!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Message reçu — Web Journey</title>
  <meta name="robots" content="noindex, nofollow">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <link href="../css/style.css" rel="stylesheet">
  <link rel="icon" type="image/x-icon" href="https://www.webjourney.ch/favicon.ico">
</head>
<body>
  <div class="menu">
    <div class="menu__left nav"></div>
    <a href="https://www.webjourney.ch/" class="logo">
      <p class="logo_text"><span class="is-da-vinci">web</span> <span class="is-da-vinci">journey</span></p>
    </a>
    <div class="menu__right nav"></div>
  </div>
  <main class="page">
    <section class="hero-section">
      <div class="c hero">
        <div class="hero_content center">
          <div class="hero_content_title">
            <h1 class="home_title w-720 txt--center">Message <span class="is-da-vinci">reçu</span></h1>
            <p class="home_subtitle txt--center">Pas de problème<?= !empty($nom_safe_tmp) ? ', ' . $nom_safe_tmp : '' ?>.<br>On ne vous recontactera plus. Merci pour votre temps.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</body>
</html><?php
    exit;
}

// Convertir URL Loom share → embed
$loom_embed = '';
if (!empty($loom_url)) {
    $loom_embed = str_replace('www.loom.com/share/', 'www.loom.com/embed/', $loom_url);
    $loom_embed = strtok($loom_embed, '?'); // retirer les query params
}

// ── Helpers HTML ────────────────────────────────────────────────────────────
function btn_svg_left(): string {
    return '<div class="courbe_left"><svg height="100%" viewbox="0 0 5 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 2C3.34315 2 2 3.34315 2 5V30C2 31.6569 3.34315 33 5 33V35L4.74316 34.9932C2.18618 34.8638 0.136224 32.8138 0.00683594 30.2568L0 30V5C0 2.32472 2.10111 0.140529 4.74316 0.00683594L5 0V2Z" fill="white"></path></svg></div>';
}
function btn_svg_right(): string {
    return '<div class="courbe_right"><svg height="100%" viewbox="0 0 5 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.256836 0.00683594C2.89889 0.140528 5 2.32472 5 5V30L4.99316 30.2568C4.86378 32.8138 2.81382 34.8638 0.256836 34.9932L0 35V33C1.65685 33 3 31.6569 3 30V5C3 3.34315 1.65685 2 0 2V0L0.256836 0.00683594Z" fill="white"></path></svg></div>';
}

function btn_svg_left_black(): string {
    return '<div class="courbe_left"><svg height="100%" viewbox="0 0 5 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 2C3.34315 2 2 3.34315 2 5V30C2 31.6569 3.34315 33 5 33V35L4.74316 34.9932C2.18618 34.8638 0.136224 32.8138 0.00683594 30.2568L0 30V5C0 2.32472 2.10111 0.140529 4.74316 0.00683594L5 0V2Z" fill="black"></path></svg></div>';
}
function btn_svg_right_black(): string {
    return '<div class="courbe_right"><svg height="100%" viewbox="0 0 5 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.256836 0.00683594C2.89889 0.140528 5 2.32472 5 5V30L4.99316 30.2568C4.86378 32.8138 2.81382 34.8638 0.256836 34.9932L0 35V33C1.65685 33 3 31.6569 3 30V5C3 3.34315 1.65685 2 0 2V0L0.256836 0.00683594Z" fill="black"></path></svg></div>';
}

$nom_safe = htmlspecialchars($nom_client, ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <?php
    $nom_entreprise_safe = htmlspecialchars($nom_entreprise, ENT_QUOTES, 'UTF-8');
    $titre_page = $nom_entreprise_safe ?: ($nom_safe ?: 'vous');
  ?>
  <title>Une offre pour <?= $titre_page ?> — Web Journey</title>
  <meta name="description" content="Web Journey a préparé une analyse personnalisée et une offre sur-mesure pour <?= $titre_page ?>.">
  <meta name="robots" content="noindex, nofollow">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <link rel="preload" href="../css/style.css" as="style">
  <link href="../css/style.css" rel="stylesheet" type="text/css">
  <link href="offre.css" rel="stylesheet" type="text/css">
  <link rel="icon" type="image/x-icon" href="https://www.webjourney.ch/favicon.ico">
</head>
<body>

  <!-- Navigation -->
  <div class="menu">
    <div class="menu__left nav">
      <a href="mailto:hello@webjourney.ch" class="mail button" aria-label="Nous écrire par email">
        <?= btn_svg_left() ?>
        <?= btn_svg_right() ?>
        <div class="mail_img"><svg viewbox="0 0 60 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M59.2324 7.77441C59.7272 9.08895 60 10.5125 60 12V32C60 38.6274 54.6274 44 48 44H12C5.37258 44 1.93283e-07 38.6274 0 32V12C0 10.5137 0.271628 9.09099 0.765625 7.77734L28.8203 22.7393L29.9971 23.3672L31.1738 22.7393L59.2324 7.77441ZM48 0C51.3326 0 54.347 1.35931 56.5215 3.55273L29.9971 17.7002L3.47559 3.55469C5.6502 1.35983 8.66617 4.86122e-08 12 0H48Z" fill="white"></path></svg></div>
      </a>
    </div>
    <a href="https://www.webjourney.ch/" class="logo">
      <p class="logo_text"><span class="is-da-vinci">web</span> <span class="is-da-vinci">journey</span></p>
    </a>
    <div class="menu__right nav">
      <a href="https://calendly.com/webjourney/20min" target="_blank" rel="noopener" class="button is-inverted nav-demarrer">
        <?= btn_svg_left() ?>
        <?= btn_svg_right() ?>
        <div class="contact_button_text_wrapper">
          <p class="button_text">Réserver un appel</p>
          <img src="../assets/images/arrow.svg" alt="Flèche" class="contact_button_arrow" width="20" height="12">
        </div>
      </a>
    </div>
  </div>

  <main class="page">

    <!-- Hero -->
    <section class="hero-section">
      <div class="c hero">
        <div class="hero_content center">
          <div class="hero_content_title">
            <h1 class="home_title w-720 txt--center">
              Bonjour<?= !empty($nom_safe) ? ',<br><span class="is-da-vinci accent-fix">' . $nom_safe . '</span>' : '' ?>
            </h1>
            <p class="home_subtitle txt--center">
              Suite à notre échange, j'ai préparé une analyse personnalisée<br>de votre présence en ligne — et une proposition concrète.
            </p>
            <div class="trait"></div>
          </div>
        </div>
      </div>
      <div class="spacer"></div>
    </section>

    <?php if (!empty($loom_embed)): ?>
    <!-- Vidéo personnalisée -->
    <section class="section is--first">
      <div class="c">
        <div class="v-flex gap--60">
          <div class="v-flex gap--30">
            <h2>Ce que j'ai <span class="is-da-vinci accent-fix">observé</span> sur votre site</h2>
            <p class="w-720">J'ai passé du temps sur votre site pour identifier ce qui freine votre visibilité et vos conversions. Voici ce que j'ai trouvé.</p>
          </div>
          <div class="loom-wrapper">
            <iframe
              src="<?= htmlspecialchars($loom_embed, ENT_QUOTES, 'UTF-8') ?>"
              frameborder="0"
              allowfullscreen
              title="Analyse personnalisée pour <?= $nom_safe ?>">
            </iframe>
          </div>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <!-- Ce qu'on propose -->
    <section class="section <?= empty($loom_embed) ? 'is--first' : 'section--alt' ?>">
      <div class="c">
        <div class="v-flex gap--60">
          <div class="v-flex gap--30">
            <h2>Ce que Webjourney <span class="is-da-vinci">vous</span> <span class="is-da-vinci">propose</span></h2>
            <p class="w-720">Un site sur mesure, conçu pour votre activité, optimisé pour Google et pensé pour convertir vos visiteurs en clients.</p>
          </div>
          <div class="solutions_wrapper">
            <div class="solution_item">
              <div class="solution_item_icon">
                <svg width="32" height="32" viewbox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="#090909"/><path d="M8 12h16M8 16h10M8 20h6" stroke="#f5f5f5" stroke-width="1.5" stroke-linecap="round"/></svg>
              </div>
              <h3 class="solution_item_title">Site vitrine sur mesure</h3>
              <p class="solution_item_text">Accueil, Services, À propos, Contact — 4 à 5 pages construites autour de votre activité et de vos objectifs. Chaque page est pensée pour que le visiteur sache immédiatement ce que vous faites et comment vous contacter.</p>
            </div>
            <div class="solution_item">
              <div class="solution_item_icon">
                <svg width="32" height="32" viewbox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="#090909"/><circle cx="16" cy="16" r="7" stroke="#f5f5f5" stroke-width="1.5"/><path d="M16 9v2M16 21v2M9 16h2M21 16h2" stroke="#f5f5f5" stroke-width="1.5" stroke-linecap="round"/></svg>
              </div>
              <h3 class="solution_item_title">Référencement optimisé</h3>
              <p class="solution_item_text">Structure technique propre, temps de chargement rapide, balises et contenus pensés pour que Google vous trouve et vous mette en avant face à vos concurrents locaux.</p>
            </div>
            <div class="solution_item">
              <div class="solution_item_icon">
                <svg width="32" height="32" viewbox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="#090909"/><path d="M10 22l6-12 6 12M13 18h6" stroke="#f5f5f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <h3 class="solution_item_title">Accompagnement complet</h3>
              <p class="solution_item_text">De la première réunion à la mise en ligne, je m'occupe de tout — design, textes, photos, nom de domaine, hébergement. Vous validez, je livre. Pas de surprise.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section is--last">
      <div class="c">
        <div class="v-flex gap--60 txt--center">
          <div class="v-flex gap--30">
            <h2 class="w-720">Prêt à faire passer votre présence<br class="br--desktop">au <span class="is-da-vinci accent-fix">niveau</span> <span class="is-da-vinci accent-fix">supérieur</span> ?</h2>
            <p class="home_subtitle">Aucun engagement. On échange 20 minutes pour voir si on peut faire quelque chose ensemble.</p>
          </div>
          <!-- TODO: remplacer par ton lien Calendly -->
          <div class="h-flex gap--15 is--centered">
            <a href="https://calendly.com/webjourney/20min" target="_blank" rel="noopener" class="button">
              <?= btn_svg_left_black() ?>
              <?= btn_svg_right_black() ?>
              <div class="contact_button_text_wrapper">
                <p class="button_text">Réserver un appel</p>
                <img src="../assets/images/arrow.svg" alt="Flèche" class="dark_button_arrow" width="20" height="12">
              </div>
            </a>
            <a href="https://www.webjourney.ch/demander-un-devis" class="button">
              <?= btn_svg_left_black() ?>
              <?= btn_svg_right_black() ?>
              <p class="button_text">Demander un devis</p>
            </a>
          </div>
          <a href="?slug=<?= urlencode($slug) ?>&action=not-interested" class="not-interested-link">Je ne suis pas intéressé</a>
        </div>
      </div>
    </section>

  </main>

  <section>
    <div class="footer">
      <div class="spacer"></div>
      <div class="footer_wrapper">
        <p class="footer_p">Une question, <span class="is-da-vinci">un</span> <span class="is-da-vinci">projet</span> ?<br>On est là.</p>
        <a href="https://www.webjourney.ch/contact" class="is--white">
          <div class="button is-inverted">
            <?= btn_svg_left() ?>
            <?= btn_svg_right() ?>
            <p>let's talk</p>
          </div>
        </a>
        <p class="footer_text">
          <a href="https://wa.me/41768445869" target="_blank" rel="noopener noreferrer" class="is--white">+41 76 844 58 69</a>
          /
          <a href="mailto:hello@webjourney.ch" class="is--white">hello@webjourney.ch</a>
        </p>
      </div>
    </div>
  </section>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
  <script>
    // Lottie chargé en synchrone — disponible immédiatement.
    // On renomme .trait → .offre-trait avant que script.js ne tente de l'initialiser
    // avec le mauvais chemin relatif /offre/documents/.
    (function() {
      function initTrait() {
        var el = document.querySelector('.trait');
        if (!el) return;
        el.classList.replace('trait', 'offre-trait');
        lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '../documents/trait_001.json'
        });
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTrait);
      } else {
        initTrait();
      }
    })();
  </script>
  <script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js" defer></script>
  <script src="../js/script.js" type="text/javascript" defer></script>

</body>
</html>
