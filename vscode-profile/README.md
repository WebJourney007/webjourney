# Profil VSCode — Starter

La config VSCode (réglages éditeur, raccourcis, icônes, extensions) prête à appliquer.
Set d'extensions **curé pour un projet web générique** — sans outils personnels superflus.
Remplace l'extension du framework (section « Stack ») par celle de ta stack réelle.

---

## Ce qui est inclus

| Fichier | Contenu |
| ------- | ------- |
| `settings.json` | Réglages éditeur, formatage (Prettier + tabs), icônes Material, thème, terminal. Chemins perso, Discord, SSH retirés. |
| `keybindings.json` | Raccourcis : `Alt+1` sidebar · `Alt+2` terminal · `Alt+3` panneau droit · `Alt+4` status bar · `Ctrl+Alt+←/→` déplacer l'éditeur. |
| `extensions.txt` | ~21 extensions (Prettier, ESLint, icônes Material, GitHub Actions, Markdown…). |
| `install.ps1` | Installe tout, **avec sauvegarde** de la config existante. |

---

## Installation — méthode automatique (recommandée)

```powershell
cd vscode-profile
pwsh -File install.ps1
```

Le script :
1. installe les extensions curées (`code --install-extension`) ;
2. **sauvegarde** `settings.json` / `keybindings.json` existants en `*.backup-<date>` ;
3. applique les nouveaux fichiers.

Puis **redémarrer VSCode**. Pour revenir en arrière : renommer les fichiers `*.backup-<date>`
dans `%APPDATA%\Code\User`.

---

## Installation — méthode manuelle (profil isolé, zéro écrasement)

Si ton ami veut **garder sa config actuelle intacte** et tester dans un bac à sable :

1. VSCode → icône engrenage (en bas à gauche) → **Profils → Créer un profil**.
2. Dans ce profil : ouvrir `settings.json` (Ctrl+Shift+P → *Open User Settings (JSON)*) et **coller** le contenu du `settings.json` fourni.
3. Idem pour `keybindings.json` (Ctrl+Shift+P → *Open Keyboard Shortcuts (JSON)*).
4. Installer les extensions de `extensions.txt` (ou lancer `install.ps1`, qui les pose globalement).

Les profils VSCode sont **basculables** : il peut revenir à sa config d'un clic.

---

## Notes

- **Police** : installe **Fira Code** (gratuite) pour les ligatures de code. Sans elle, VSCode prend une police de repli — aucun bug, juste pas de ligatures.
- **Thème** : `Monokai Pro` est une **extension payante**. Si absente, le thème gratuit **Dark Palenight (mkers)** (inclus) sert de repli — change `workbench.colorTheme` dans `settings.json`.
- **Langue FR** : le pack `ms-ceintl.vscode-language-pack-fr` met l'UI en français. Retire-le de `extensions.txt` pour rester en anglais.
- **Mac/Linux** : les chemins de terminal Windows (`PowerShell 7`) seront ignorés ; le reste fonctionne.
