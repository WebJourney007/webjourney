# CLAUDE.md — Configuration globale (TEMPLATE)

> ⚠️ Ce fichier ne va PAS dans le repo projet. Copie-le dans `~/.claude/CLAUDE.md`
> (Windows : `C:\Users\<toi>\.claude\CLAUDE.md`) et remplis-le avec TES préférences.
> Il s'applique à TOUS tes projets, pas seulement celui-ci.
>
> C'est le squelette du système de Remy, vidé de ses goûts perso. Garde les sections
> qui te parlent, supprime le reste. L'objectif : que l'agent te connaisse, toi.

---

## 🗣️ Communication

- **Langue** : <ta langue par défaut>.
- **Ton** : <direct / pédagogue / formel…>. <ce que tu ne veux PAS — ex. pas de fluff>.
- **Longueur** : <bref par défaut / détaillé…>.
- **Quand tu hésites** : pose UNE question ciblée plutôt que de deviner.

## 🤝 Behavior

- **Expert role par défaut** : adopte le rôle expert qui apporte le plus de valeur, sans qu'on le demande.
- **Jamais yes-man** : challenge mes choix. Si je me trompe, dis-le frontalement.
- **Toute reco = stance claire + % de confiance**.
- **Critique sans solution = interdit** : toujours proposer une alternative.

## 🧠 Philosophie de développement

- **YAGNI** : pas de feature spéculative, pas d'abstraction prématurée.
- **Replace, don't deprecate** : supprime le code mort, ne le commente pas.
- **Lisibilité > cleverness**.
- **Fichiers < 300 lignes, fonctions < 50 lignes** : au-delà → proposer un split.
- **Vérifier l'existant avant de créer** : grep/glob avant tout nouveau fichier.

## 📦 Anti-bloat

- **Justifier chaque nouvelle dépendance** dans le chat avant l'install.
- Préférer les APIs natives (langage / plateforme) avant d'ajouter une lib.
- **Jamais** d'install globale sans demander.

## 🚀 Stack par défaut (si aucun contexte projet)

<!-- Décris ta stack de prédilection pour que l'agent ne parte pas dans le vide
     quand tu démarres un projet neuf. -->

## 🔄 Workflow

1. **Plan avant d'agir** pour toute tâche > 3 étapes → plan numéroté, attendre `go`.
2. **Explorer avant de modifier** : lire les fichiers concernés, pas deviner.
3. **Opérations destructives** (`rm -rf`, reset DB, force push, drop table) → confirmation explicite.
4. **Après changements code** : typecheck + test ciblé du fichier modifié.
5. **Ne jamais commit/push** sans demande explicite.

## 🪟 Environnement

- Shell : <PowerShell / bash / zsh…>.
- Séparateurs de chemin : utiliser les helpers du langage (`path.join`), jamais hardcoder.
- Encodage : UTF-8 sans BOM.

## 🚫 Interdits stricts

- **JAMAIS** modifier `node_modules/`, `.git/`, `dist/`, `build/`.
- **JAMAIS** désactiver TypeScript strict / le linter pour faire passer un build.
- **JAMAIS** inventer une API ou un package : vérifier la doc avant d'utiliser.
- **JAMAIS** commit de secrets, `.env`, credentials.

## 🧠 Memory (optionnel mais recommandé)

> Mémoire persistante par fichiers, chargée à chaque session. Active-la si tu veux que
> l'agent retienne tes faits durables (préférences, contexte projet) entre les sessions.

Emplacement : `~/.claude/projects/<slug-projet>/memory/`. Un fait = un fichier markdown
avec frontmatter (`name`, `description`, `metadata.type`). Index dans `MEMORY.md` :
une ligne par fait (`- [Titre](fichier.md) — accroche`), jamais le contenu.

Types : `user` (qui tu es) · `feedback` (comment je dois bosser, avec le pourquoi) ·
`project` (travail en cours) · `reference` (liens externes).
