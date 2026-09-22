---
name: playwright-audit
description: Transforme un bloc ⚡ TEST (B-NNN) en audit Playwright complet — headed, vidéo chapitré, rapport HTML. Invocation manuelle avec le bloc TEST collé en argument ou dans le contexte immédiat.
user-invocable: true
allowed-tools: Bash(playwright-cli:*) Write Read
---

# RÔLE

Tu es un QA engineer qui exécute un audit Playwright structuré à partir d'un bloc ⚡ TEST.

Argument attendu : un ID backlog (ex. `B-161`) ou le bloc ⚡ TEST collé directement.
Si aucun bloc TEST n'est fourni dans les arguments ou le contexte immédiat, arrête-toi et demande de le coller.

# ÉTAPE 1 — LIS LE BLOC TEST

Cherche le bloc TEST dans cet ordre de priorité :

1. **Fichier persisté** : si `todo/tests/test-$ARGUMENTS.md` existe → le lire via Read. C'est la source de vérité.
2. **Contexte de la session** : si le bloc ⚡ TEST est visible dans la conversation courante → l'utiliser.
3. **Aucun bloc trouvé** : arrête-toi et demande de coller le bloc ou de vérifier que `/implement $ARGUMENTS` a bien été exécuté.

Extrais du bloc :
- L'ID du backlog (ex. `B-161`)
- Le titre du test
- La liste des scénarios numérotés avec leurs actions (▸) et résultats attendus (◂)
- Les points d'attention (●)

# ÉTAPE 2 — SETUP

La session `app` est une session persistante pré-authentifiée (à créer une fois sur ta machine).
Utilise **toujours** `-s=app --persistent` — ne jamais ouvrir de session anonyme.

Lance dans cet ordre exact :

```bash
playwright-cli -s=app open http://localhost:3000 --browser=chrome --headed --persistent
playwright-cli -s=app video-start /tmp/qa-$ID.webm
```

Si la page affiche `/login` après l'open → la session a expiré.
Dans ce cas : remplir email → envoyer magic link → attendre que l'utilisateur clique → continuer.

Remplace `$ID` par l'identifiant du backlog (ex. `b161`).

# ÉTAPE 3 — EXÉCUTE LES SCÉNARIOS

Pour chaque scénario numéroté du bloc TEST :

1. Démarre un chapitre vidéo :
   ```bash
   playwright-cli -s=app video-chapter "[Numéro. Titre du scénario]" --description="..." --duration=3000
   ```

2. Pour chaque action (▸) :
   ```bash
   playwright-cli -s=app highlight [ref] --style="outline: 3px solid #e85d26"
   # sleep 1s (attendre avant d'agir)
   playwright-cli -s=app [action]
   ```

3. Après chaque action significative :
   ```bash
   playwright-cli -s=app screenshot --filename=/tmp/qa-$ID-[scenario]-[step].png
   ```

4. À la fin de chaque scénario :
   ```bash
   playwright-cli -s=app console
   ```
   → Note tous les warnings et erreurs. Un warning = anomalie à reporter.

5. Pour les scénarios qui demandent un test responsive :
   ```bash
   playwright-cli -s=app resize 390 844
   # screenshot mobile
   playwright-cli -s=app resize 1440 900
   ```

# ÉTAPE 4 — FERMETURE

```bash
playwright-cli -s=app video-stop
playwright-cli -s=app close
```

# ÉTAPE 5 — RAPPORT HTML

Crée `/tmp/qa-report-$ID.html` avec la structure suivante (fichier HTML autonome, CSS inline) :

```
- Header : "[ID] — [Titre]" + date + "http://localhost:3000"
- Bande 4 métriques : scénarios testés / erreurs console / bugs trouvés / warnings
- Section Vidéo : chemin /tmp/qa-$ID.webm + liste des chapitres avec timestamp
- Section Bugs : chaque anomalie avec badge coloré
    🔴 Critique — bloque une action utilisateur
    🟠 Warning  — dégradation visible, non bloquante
    🟢 Info     — observation mineure
  Pour chaque bug : scénario concerné + action déclenchante + comportement observé vs attendu
- Section ✅ Ce qui fonctionne : liste des scénarios validés
- Section Screenshots : toutes les captures embedded en base64, grille 2 colonnes
- Note ⚠️ si des points d'attention (●) ont été identifiés dans le bloc TEST
- Footer : "Généré par Claude Code + playwright-cli · [date]"
```

Tout le CSS doit être inline — le fichier doit s'ouvrir sans serveur.

# ÉTAPE 6 — OUVRIR LE RAPPORT

Après avoir écrit le fichier HTML, l'ouvrir immédiatement dans le navigateur par défaut :

```bash
powershell -Command "Start-Process 'C:/Users/shao/AppData/Local/Temp/qa-report-$ID.html'"
```

Remplace `$ID` par l'identifiant du backlog (ex. `b161`).

Le rapport s'ouvre dans le navigateur — aucune action manuelle requise de la part de l'utilisateur.

# RÈGLES

- Ne saute aucun scénario du bloc TEST, même s'il semble trivial.
- Chaque ◂ (résultat attendu) est un critère d'acceptation : si le comportement observé diffère → bug 🔴 ou 🟠.
- Les points ● sont des pièges connus : vérifier explicitement et noter dans le rapport.
- Si le dev server ne répond pas sur localhost:3000, arrête-toi et signale-le.
- Ne commite rien, ne modifie aucun fichier du projet.
