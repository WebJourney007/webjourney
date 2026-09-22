# `.gitignore` — référence

> Référence interne sur ce qui est ignoré par Git, pourquoi, et comment maintenir la propreté du repo.

---

## 1. Objectif du `.gitignore`

Le fichier `.gitignore` à la racine du repo empêche Git de suivre certains fichiers. Ses cinq objectifs :

- **Éviter de versionner les secrets** — clés API, tokens, mots de passe dans `.env`
- **Éviter de versionner les dépendances** — `node_modules/` est réinstallable, inutile à stocker
- **Éviter de versionner les fichiers générés** — `.next/`, `dist/`, `build/` sont produits par des commandes, pas par des humains
- **Éviter les conflits liés aux fichiers locaux** — `.vscode/`, `.DS_Store` varient d'une machine à l'autre
- **Garder le repo propre et portable** — un clone propre doit fonctionner sans friction

---

## 2. Catégories ignorées

| Catégorie         | Exemples                          | Pourquoi c'est ignoré                          |
| ----------------- | --------------------------------- | ---------------------------------------------- |
| Dépendances       | `node_modules/`                   | Réinstallable via `npm install` / `pnpm i`     |
| Builds            | `.next/`, `dist/`, `build/`, `out/` | Généré automatiquement — ne pas stocker        |
| Déploiement       | `.vercel/`, `.cache/`, `coverage/` | Artifacts de CI/CD et tests, non nécessaires  |
| Secrets           | `.env`, `.env.*`                  | Contient des clés API, tokens, mots de passe   |
| Logs              | `*.log`, `npm-debug.log*`         | Bruit inutile, taille variable                 |
| Éditeurs          | `.vscode/`, `.idea/`              | Préférences locales non partageables           |
| OS                | `.DS_Store`, `Thumbs.db`          | Fichiers système macOS / Windows               |
| ClaudeCode local  | `.claude/settings.local.json`     | Surcharges personnelles, non partagées         |
| Fichiers temporaires | `*.tmp`, `*.temp`, `*.bak`, `*.swp` | Fichiers de travail jetables                |

---

## 3. Fichiers à versionner malgré tout

Certains fichiers doivent rester dans Git même si leur catégorie pourrait sembler ignorable :

```txt
CLAUDE.md                        → instructions IA du projet
docs/**                          → documentation officielle, source de vérité
.claude/settings.json            → réglages Claude Code partagés par l'équipe
.env.example                     → template des variables d'environnement (sans valeurs)
package.json                     → déclaration des dépendances
package-lock.json / pnpm-lock.yaml / yarn.lock  → versions exactes verrouillées
zarchives/                       → données archivées de référence
```

La règle `!.env.example` dans le `.gitignore` permet d'exclure tous les `.env.*` tout en réincluant explicitement `.env.example`.

---

## 4. Cas particulier ClaudeCode

| Fichier                        | Versionner ? | Raison                                              |
| ------------------------------ | ------------ | --------------------------------------------------- |
| `.claude/settings.json`        | ✅ Oui       | Réglages partagés (permissions projet, allowlist)   |
| `.claude/settings.local.json`  | ❌ Non       | Surcharges personnelles, tokens locaux              |
| `.claude/skills/`              | ✅ Oui       | Skills projet partagées (si créées un jour)         |
| `.claude/commands/`            | ✅ Oui       | Commandes personnalisées projet (si créées un jour) |

**Rappel :** les specs produit ne vivent pas dans `.claude/` — elles vivent dans `docs/`. Voir [claude-code.md](claude-code.md).

---

## 5. Workflow avant push

Avant tout push important, exécuter ces commandes dans l'ordre :

```bash
# 1. Voir ce qui est modifié / ajouté
git status

# 2. Voir exactement ce qui sera committé
git diff --cached --name-only

# 3. Vérifier pourquoi un fichier est ignoré (ou non)
git check-ignore -v <fichier>
```

### Checklist pré-push

- [ ] Aucun fichier `.env` dans les fichiers stagés
- [ ] Aucun `node_modules/` commité
- [ ] Aucun build généré (`.next/`, `dist/`, `build/`)
- [ ] Aucun fichier local ClaudeCode (`.claude/settings.local.json`)
- [ ] Aucun fichier temporaire (`*.tmp`, `*.bak`, `*.swp`)
- [ ] Les docs importantes sont bien trackées (`docs/`, `CLAUDE.md`)
- [ ] `README.md` à jour si un fichier a été ajouté, renommé ou supprimé
- [ ] Aucune clé API ou token en clair dans le code commité

---

## 6. Que faire si un fichier ignoré est déjà tracké

Si un fichier qui devrait être ignoré a déjà été commité dans le passé, Git continue de le suivre même après l'ajout de la règle dans `.gitignore`. Il faut le retirer de l'index sans le supprimer localement :

```bash
# Retirer un fichier unique de l'index Git
git rm --cached <fichier>

# Retirer un dossier entier de l'index Git
git rm --cached -r <dossier>/

# Puis commiter le retrait
git commit -m "chore: stop tracking local ignored file"
```

Cette opération :
- Retire le fichier du suivi Git
- **Ne supprime pas** le fichier localement
- Il sera ignoré à partir du prochain commit

⚠️ Vérifier avant que le fichier ne contient pas de données dont d'autres membres ont besoin.

---

## 7. Règles projet

1. **Avant chaque push important** : `git status` → vérifier la checklist ci-dessus.
2. **Avant d'ajouter un nouveau type de fichier généré** : vérifier s'il doit être ignoré et ajouter la règle si nécessaire.
3. **Avant d'ajouter une config locale** : vérifier si elle contient des secrets ou des chemins absolus — si oui, l'ignorer.
4. **Ne jamais commiter `.env`** sous quelque forme que ce soit (`.env.production`, `.env.local`…).
5. **Ne jamais commiter `node_modules/`** — si le projet évolue vers npm, vérifier que la règle est bien active.
6. **Ne jamais commiter `.claude/settings.local.json`** — réglages personnels uniquement.
7. **Si une config doit être partagée** : créer une version `.example` documentée, sans valeurs réelles.
8. **Signaler immédiatement** tout fichier sensible détecté dans l'historique Git — ne pas tenter de corriger seul sans plan.
