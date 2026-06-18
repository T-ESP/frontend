# TODO

## KPIs / Graphiques
- [x] **Overlay sur les KPIs (graphiques)** — tooltip au survol affichant la valeur du point (Dashboard `KPICard` + `KpiStatCard`).
- [x] **"Le truc $"** — remplacé tous les `$` par des `€` placés en suffixe (LatestPayments, données mock dashboard/inventory/sales, pages pricing, Demo).
- [x] **Dernier paiement "0 sur 6"** — passé à 10 avec scroll interne (header sticky) et suppression du footer « lignes sélectionnées » inutile.
- [X] **Produit performant** — la note affichée n'est pas la même au clic, et certaines notes dépassent 5 (bug de calcul/plafond à corriger).
- [x] **Infobulles (i) sur la page KPI** — ajouter un icône `(i)` à chaque KPI pour expliquer ce que c'est.
- [x] **Arrondis** — arrondir les valeurs sans virgule là où c'est cohérent (ex : stockage moyen, et ailleurs).

## Navigation / Liens entre pages
- [x] **Accès aux KPIs d'un produit** — composant réutilisable `ProductKpiLink` (→ `/inventory/:id/kpis`). Appliqué à la table « Alertes critiques » (Insights) ; TopProducts (Dashboard) pointe désormais directement vers les KPIs.

## Inputs / Formulaires
- [x] **Input "Euro par point" buggé** — saisie difficile, la flèche fait des comportements bizarres (ex : 8.1), impossible d'effacer le premier chiffre. (Fix : champs stockés en string, `min="0"` pour éviter le snap des flèches.)

## Alertes & Prévisions
- [x] **Alertes & prévisions — problème de calcul** — le calcul est côté backend (hors repo frontend). Côté front : infobulles `(i)` par métrique sur la section Prédictions (`ProductKPIsPage`) expliquant statut, jours de couverture, date de rupture (= aujourd'hui + jours de couverture), quantité et point de réappro — clarifie l'incohérence apparente. _Si un vrai bug de calcul subsiste, il faut le corriger côté API._
- [x] **Alertes par produit — garder les plus récentes** :
  - [x] Ne conserver que les alertes les plus récentes par produit. (Dédup par `product_id` dans `AlertsPage`, on garde la plus récente.)
  - [x] Au clic sur une alerte → afficher l'historique des anciennes alertes (avec leurs dates). (Clic sur la ligne → modale-timeline de toutes les alertes du produit, triées par date/heure, badge « Plus récente » ; pastille `🕐 N` sur les lignes ayant un historique.)
  - [ ] Bouton de redirection vers la page Inventaire avec le nom du produit déjà appliqué dans les filtres.

## Dashboard
- [x] **Plus de KPIs à choisir** — catalogue extensible (`KPICards/kpiCatalog.ts`) recensant les KPIs des pages Ventes/Commandes/Inventaire/Fournisseurs/Équipe ; sélectionnables via la modale « Éditer » groupée par catégorie. Préférence persistée en localStorage.

## Sidebar / Onboarding
- [x] **Sous-menus de la sidebar** — items regroupés en sections nommées (Pilotage / Activité / Engagement) via `SidebarGroupLabel`.
- [x] **Onboarding / tutoriel** — tour guidé spotlight (driver.js) : grise tout sauf la zone montrée, bulle de texte + progression, bouton passer/Échap. ~7 étapes courtes (navigation, KPIs, perso, période, alertes, assistant). Démarre auto à la 1re visite du dashboard (flag localStorage) ; rejouable via le bouton `?` du header. Code dans `src/ui/features/onboarding/`.
