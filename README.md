# Raamii — le jeu de Rami (application Android)

Jeu de Rami : 108 cartes, jusqu'à 6 joueurs, deux règles au choix (règle de la maison ou Rami classique), solo contre l'IA ou entre amis sur le même téléphone.

- **Télécharger l'APK Android :** https://github.com/pirax84/raamii/releases/latest/download/Raamii.apk
- **Installer sur le téléphone :** voir [INSTALLER.md](INSTALLER.md)

## Ce que contient le projet
| Dossier | Rôle |
|---|---|
| `www/` | L'application (pages, styles, jeu, IA, langues, boutique, compte) |
| `android/` | Le projet Android (Capacitor) : plein écran, rotation libre, micro/caméra, icône Raamii |
| `supabase/schema.sql` | La base de données : profils, sauvegardes, parties, classement, salons |
| `.github/workflows/android.yml` | Fabrique `Raamii.apk` automatiquement à chaque mise à jour et le publie dans *Releases* |
| `docs/MONETISATION.md` | Fidélisation (cadeau du jour, défis, niveaux) et plan de revenus |
| `tests/` | Tests des règles et parties simulées entre 6 IA |

## Brancher Supabase (une fois)
1. Crée un projet sur https://supabase.com (gratuit), nom : **raamii**.
2. Dans **SQL Editor**, colle tout le contenu de `supabase/schema.sql` puis **Run**.
3. Dans **Project Settings > API**, copie la **Project URL** et la clé **anon public**.
4. Sur GitHub : **Settings > Secrets and variables > Actions > New repository secret** :
   - `SUPABASE_URL` = la Project URL
   - `SUPABASE_ANON_KEY` = la clé anon public
5. Onglet **Actions** > **APK Android Raamii** > **Run workflow** : le nouvel APK sait se connecter.

Sans Supabase, l'appli marche entièrement hors ligne.

## Pour les développeurs
```
npm ci
npm test
npm run apk        # fabrique android/app/build/outputs/apk/debug/app-debug.apk (Android SDK + Java 21)
```
La clé de signature `android/app/raamii.keystore` garde la même signature d'une version à l'autre (les mises à jour s'installent par-dessus). Pour le Play Store, une clé privée distincte sera créée.
