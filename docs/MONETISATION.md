# Raamii — fidélisation et monétisation

Objectif : un jeu **gratuit et agréable**, sans publicité imposée, qui donne envie de revenir chaque jour et qui rapporte grâce à des achats **facultatifs**.

## 1. Ce qui fait revenir les joueurs (déjà dans l'appli 1.3)
| Mécanique | Comment ça marche |
|---|---|
| Cadeau du jour | 7 jours de suite : 20 → 30 → 40 → 50 → 60 → 80 → **150 pièces**. Un jour manqué = la série recommence. S'ouvre tout seul à la première ouverture du jour. |
| Défis du jour | 3 défis tirés au sort chaque jour (gagner une partie, poser 5 combinaisons, ouvrir 2 fois, finir sec…) : pièces + XP. |
| Niveaux | De l'XP à chaque manche, combinaison, défi. Chaque nouveau niveau donne 50 × niveau pièces. |
| Personnalisation | Dos de cartes et tapis à débloquer avec les pièces (Aurore, Lagon, Corail, Prune, Océan…). |
| Classements | Sur l'appareil + en ligne (Supabase) + classement de la semaine (base prête pour les tournois). |

## 2. Sources de revenus (structures prêtes, à brancher)
| Produit | Prix conseillé | État |
|---|---|---|
| Packs de pièces | 0,99 € (500) · 2,99 € (1 800) · 6,99 € (5 000) | Prêt dans l'appli, « Bientôt » |
| Pack de démarrage (1 fois) | 1,99 € : 1 500 pièces + tapis exclusif | Prêt à ajouter |
| VIP mensuel | 2,99 €/mois : cadeau du jour × 2, skins VIP, sans aucune pub, tournois illimités | Table `entitlements` prête |
| Pass saison (2 mois) | 4,99 € : défis bonus + 3 skins exclusifs | Table `entitlements` prête |
| Vidéos récompensées | 30 pièces, 5 max par jour, **uniquement si le joueur le choisit** | Fonction `claim_ad_reward` prête |

Pas de publicité forcée entre les parties : c'est ce qui garde les joueurs.

## 3. Ce qu'il reste à brancher (le moment venu)
1. **Compte Google Play Console** — 25 $ une seule fois (c'est le seul coût, à décider plus tard) pour publier et vendre.
2. **Achats intégrés** : extension Capacitor « RevenueCat » (gratuite jusqu'à 2 500 $/mois de revenus), qui vérifie les reçus Google Play puis écrit dans `purchases` et `entitlements`.
3. **Vidéos récompensées** : AdMob (gratuit, Google paie à l'affichage) avec l'extension `@capacitor-community/admob`.
4. **Salons entre amis et tournois** : la table `rooms` et le classement de la semaine sont prêts ; il restera la partie en direct (Supabase Realtime).

## 4. Principes
- Tout le jeu reste jouable gratuitement, sans payer pour gagner.
- Achats uniquement esthétiques ou de confort (skins, pièces pour skins, VIP).
- Prix clairs, remboursement Google Play respecté, aucune donnée bancaire dans l'appli.
