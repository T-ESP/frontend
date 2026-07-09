# Démo commerciale StockS — 7 minutes

## Contexte

- **Public** : le prof examinateur, qui joue le rôle d'un prospect découvrant le produit.
- **Format** : projet libre, pas de grille de notation par fonctionnalité. On est jugé sur la cohérence et la maîtrise, pas sur le nombre de modules montrés.
- **Matériel** : produits physiques + douchette USB.
- **Débit mesuré** : 216 mots/min en lecture (106 mots en 29,5 s). **Rythme cible en démo : 135 mots/min.**
  Budget total ≈ 660 mots parlés sur 7 min (décote de 30 % pour les silences, scans, chargements).

---

## La trame

> **Un paquet de café traverse le système, du scan jusqu'à la commande fournisseur.**

Tout ce qu'on montre est la conséquence de ce qu'on vient de montrer. Le prospect ne voit pas sept modules, il voit une chaîne de réaction déclenchée par un geste physique.

| Acte | Durée | Contenu | Ce que ça prouve |
|---|---|---|---|
| 1. Le problème | 0:36 | Landing figée, le paquet en main | Le tableur est l'ennemi |
| 2. La routine | 0:53 | Login → récap auto → dashboard | L'information vient à Sarah |
| 3. Le geste | 1:33 | Scan, fidélité, promo auto, monnaie | Un geste, quatre actions |
| 4. La conséquence | 0:48 | Inventory en rupture → Insights | Le système diagnostique |
| 5. La décision | 1:09 | KPI produit → assistant IA | La commande fournisseur est prête |
| 6. Clôture | 0:33 | Retour au paquet | Contrat rempli |

### Les quatre charnières

Ce sont les phrases de passage. Elles constituent la vraie trame — à apprendre par cœur, le reste peut s'improviser.

1. **Routine → geste** : « Neuf heures. La première cliente entre. » *(passage au présent)*
2. **Geste → conséquence** : « Ce paquet que je viens de vendre, c'était le dernier. Regardez. » *(la plus importante)*
3. **Conséquence → décision** : « Sarah clique. Et le système lui dit quoi faire. »
4. **Décision → clôture** : reprendre le paquet en main. Le geste annonce la fin avant les mots.

### Modules traversés sans jamais faire le tour du propriétaire

Caisse, scan matériel, stock, fidélité, promotions, commandes, alertes, KPIs, ML, chatbot. Dix briques, aucune présentée comme une brique.

### Banc de touche (pour les questions)

Multi-magasin par sous-domaine · gestion des employés · export de facture PDF · KPIs par commande · export CSV.

### Pages à ne JAMAIS ouvrir

`/clients` (données en dur, boutons morts) · `/settings` (maquette statique) · `/playground` (route non protégée) · **`/predictions` et `/alerts`** (voir ci-dessous : tables du batch vides).

---

## Vérifications techniques (faites, code à l'appui)

### Ce qui marche vraiment

- **Le récap quotidien s'ouvre tout seul.** `AppLayout.tsx:33` monte `<DailyRecap />`. Il se déclenche dès que l'email est présent après login.
- **La vente décrémente le stock.** `orders/handlers.rs:296-320` : `UPDATE products_pro SET stock_quantity_pro = stock_quantity_pro - $1` par ligne, dans la transaction. Bascule le statut en `out_of_stock` à zéro.
- **Caisse** : scan par code-barres, fidélité (points réels), promotions auto (`POST /discounts/check`), rendu de monnaie — tout est réel et branché.
- **Insights** réagit en direct : donut et ABC recalculés côté navigateur à chaque chargement.

### Pourquoi `/predictions` et `/alerts` sont hors démo

**Les six cartes ML de `/predictions` sont vides, et c'est structurel.** Le forecaster ne retient un produit que s'il a été vendu sur **≥ 30 dates distinctes** sur 2 ans (`demand_forecaster.py:74-82`) :

```sql
GROUP BY lor.product_id_lor
HAVING COUNT(DISTINCT DATE(o.order_date_ord)) >= 30
```

Aucun produit ne passe ce filtre → `demand_forecasts` reste vide → pas de notification → `/alerts` vide → pas de réappro urgent. Le batch tourne bien (`Dockerfile:27` lance `python main.py`, `main.py:94` démarre le scheduler, cron `0 2 * * *`), il ne trouve simplement **personne à qui parler**. Il se termine en succès avec « 0 successful, 0 failed ».

⚠️ **Le bandeau de KPI de `/predictions` n'est PAS de l'IA.** `global_kpis/services.rs:1231`, commentaire présent dans le code :

```rust
// Prévisions (simple: extrapolation linéaire)
let forecasted_revenue_next_month = Some(daily_revenue * 30.0);
```

Les 25 228 € affichés = CA quotidien moyen × 30. Montrer cet écran en disant « moteur IA » devant quelqu'un qui peut ouvrir le fichier, c'est le pire scénario.

### Les autres pièges

- **Scanner une unité de trop = erreur 422** `INSUFFICIENT_STOCK` (`orders/handlers.rs:147-160`). Le backend rejette **la commande entière**.
- **Le ticket email passe par SendGrid, pas SMTP.** `SENDGRID_API_KEY` est **absente** du `.env` → toast d'erreur rouge (`common/email.rs:12-44`). Le champ est optionnel : **le laisser vide.**
- **Insights n'utilise AUCUNE IA.** Trois `if` avec seuils en dur + un tri, calculés dans le navigateur. **Ne jamais dire « IA » sur Insights.**
- **L'ABC d'Insights classe par valeur immobilisée** (`buying_price × stock_quantity`). Le café à 0 tombe en classe C. Ne jamais dire qu'il est en classe A.
- **Le seul vrai moment d'IA de la démo est l'assistant** (Groq + tool-calling + streaming, indépendant du batch).

---

## Checklist de préparation (le matin même)

1. Créer des commandes datées **d'hier** et **d'avant-hier** (sinon pas de récap, pas de badge de croissance).
2. **Stock du café = 3.** Compter le stock exact = nombre d'unités qu'on va scanner. **Toute la trame repose sur ce chiffre.**
3. Donner au café un **prix d'achat supérieur** aux autres produits en stock bas, pour qu'il soit en tête du tableau des produits critiques d'Insights.
4. **Vérifier la page KPI du café** (`/inventory/:id/kpis`) : elle doit afficher une date de rupture estimée et une quantité de réappro, pas des tirets. Ces heuristiques ont besoin d'un peu d'historique de ventes.
5. **Tester l'assistant IA** avec la question exacte, trois fois de suite.
6. Vider `localStorage` → clé `stocks:daily-recap:<email>` (sinon le récap ne se rouvre pas).
7. Passer l'interface **en français** (elle est en anglais par défaut).
8. **Ne plus se reconnecter avant la démo.**
9. Tester **tous les codes-barres** — chaque produit physique doit avoir sa `reference` en base.
10. Landing déjà affichée à l'écran avant de prendre la parole.

---

# ACTE 1 — Le problème

**Durée : 36 s · 72 mots**

### Mise en scène

- **Écran** : landing page, immobile. On ne la présente pas, on ne la scrolle pas.
- **Mains** : le paquet de café. On ne touche pas la souris.

### Objectifs

1. Planter un personnage — Sarah, une gérante, pas « l'utilisateur ».
2. Nommer le concurrent réel, une seule fois : le tableur.
3. Chiffrer la douleur. Un problème sans chiffre n'est pas un problème.
4. **Passer un contrat** : annoncer précisément ce qu'on va montrer.

### Script

> Sarah tient une épicerie fine à Lyon. Ce paquet de café, il lui rapporte quatre euros.
>
> ***(poser le paquet sur la table — 2 secondes de silence)***
>
> Mais s'il est en rupture jeudi prochain, il lui coûte trois clients. Et ces trois clients-là, ils ne reviennent pas forcément.
>
> Aujourd'hui, Sarah gère son stock sur un tableur.
>
> ***(reprendre le paquet)***
>
> Pendant les sept prochaines minutes, vous allez suivre ce paquet de café. Du scan en caisse, jusqu'à la commande fournisseur que le système va préparer tout seul.

### Notes de jeu

- **Le silence après « quatre euros »** n'est pas décoratif. Tant qu'on parle, le paquet est un accessoire ; quand on se tait et qu'on le pose, il devient le sujet. Compter deux secondes dans sa tête.
- **« Sarah gère son stock sur un tableur »** : cinq mots, dits une seule fois, sans commentaire. Ne pas expliquer. On y reviendra une seule autre fois, à la caisse.
- **La dernière phrase est un engagement chiffré.** On promet les deux extrémités de la chaîne. Il faudra les tenir.

### Contrôle de rythme

⏱ **Le chrono doit afficher entre 35 et 40 secondes à la fin de l'acte 1.**
S'il affiche 27 s → tu es à 160 mots/min, tu accélères sous le stress. Ralentis délibérément sur l'acte 2.

### Risque

Aucun. Pas de clic, pas de réseau, pas de donnée. Si le backend est tombé, personne ne le sait encore. C'est pour ça que cet acte est en premier : 36 secondes pour poser la voix avant que quoi que ce soit puisse planter.

---

# ACTE 2 — La routine

**Durée : 53 s · 82 mots parlés (36 s) + login, chargement et silences (17 s)**
**⏱ Cumul à la fin de l'acte 2 : 1:29**

### Mise en scène

1. **Le login.** Taper, valider, ne pas commenter. Un écran de connexion n'a jamais vendu un logiciel.
2. **Le récap quotidien.** Il s'ouvre seul. Premier effet, gratuit. Affiche « Bonjour [prénom] », « Votre journée d'hier », 4 tuiles (CA, commandes, panier moyen, nouveaux clients) avec badges de croissance vs avant-veille, et une ligne livrées / en attente / ruptures.
3. **Le dashboard.** On y arrive par le bouton **« Voir le tableau de bord »** du récap, pas par le menu.

### Ne pas scroller le dashboard

Le dashboard contient un **AlertsWidget** qui lit `alertService.getAll()` et `aiPredictionsService.getUrgentRestocks()` — les deux sources du batch, donc **vides**. Scroller ne révèle rien de compromettant, mais affiche un encart d'alertes désert.
→ **Rester en haut du dashboard.** De toute façon on n'a qu'une minute.

### Script

> **Huit heures. Sarah ouvre sa boutique.**
>
> *(taper les identifiants, valider — silence pendant le chargement)*
>
> Elle n'a rien demandé, rien cliqué. StockS lui présente sa journée d'hier : son chiffre d'affaires, ses commandes, son panier moyen, et la croissance comparée à l'avant-veille.
>
> *(clic sur « Voir le tableau de bord »)*
>
> Son tableau de bord. Ces indicateurs, c'est elle qui les a choisis — un caviste et un fleuriste ne suivent pas les mêmes chiffres. Sept jours, trente jours, un an.
>
> *(lâcher la souris, regarder le public)*
>
> Dix secondes. Elle sait où elle en est. Et elle n'a ouvert aucun fichier.
>
> *(silence — 2 secondes)*
>
> **Neuf heures. La première cliente entre.**

### Notes de jeu

- **« Elle n'a rien demandé, rien cliqué » se dit PENDANT que la modale apparaît**, pas après. Les mains visiblement loin du clavier. C'est la synchronisation qui fait la preuve : le dire après, c'est une affirmation ; le dire pendant, c'est une démonstration.
- **Ne pas ouvrir le mode Éditer** des KPI. « Un caviste et un fleuriste ne suivent pas les mêmes chiffres » fait le travail en huit mots. Ouvrir une interface de configuration en démo, c'est devoir la refermer.
- **« Neuf heures. La première cliente entre. »** = charnière n°1. Passage au présent, on se lève vers la douchette. Silence avant. On ne commente plus, on joue.

### Plan B

Le récap ne s'ouvre que si (1) l'email est chargé, (2) la clé `localStorage` n'a pas déjà la date du jour, (3) `orderService.getAll()` répond.

**S'il ne s'affiche pas : ne jamais le mentionner.** Enchaîner directement sur « Son tableau de bord. Ces indicateurs, c'est elle qui les a choisis… ». Personne ne saura qu'il manquait quelque chose.

> ❌ La faute impardonnable : « normalement il y a une popup qui s'affiche ici. »
> On vient de transformer une absence invisible en panne visible.

**Corollaire** : ne pas répéter le matin même sans revider la clé `stocks:daily-recap:<email>`. C'est le scénario d'échec le plus probable, et il est entièrement de notre fait.

---

# ACTE 3 — Le geste

**Durée : 1:33 · 118 mots parlés (52 s) + scans, recherche client, paiement, silences (41 s)**
**⏱ Cumul à la fin de l'acte 3 : 3:02** *(27 s d'avance sur le budget — c'est la marge pour les imprévus)*

Le cœur de la démo. Seul moment de manipulation physique, seul acte où l'on *utilise* le produit au lieu de le regarder.

### ⚙️ La décision qui commande tout : stock du café = 3

- **Stock 1** → le batch calcule `days_until_stockout = 0`, l'alerte dit « rupture dans ~0 jours ». La ligne de l'acte 4 tombe à l'eau.
- **Stock 3** + historique ~1,5 vente/jour → le batch écrit « rupture dans ~2 jours », urgence `URGENT`, alerte `CRITICAL` créée. La cliente achète les 3 derniers paquets. **La prédiction était juste, la réalité est allée plus vite.** C'est la scène de l'acte 4.

→ **La cliente prend 3 cafés + 2 autres produits** (pour que le panier déclenche la promotion).

### ✉️ Ticket email : NE PAS remplir le champ

`SENDGRID_API_KEY` est **absente** du `.env` et `docker-compose.yml:58` la passe vide. Un envoi échouerait avec un toast rouge (`email.rs:16`). Le champ est optionnel : **laissé vide → aucun appel, aucune erreur.** Le ticket email va sur le banc de touche.

### Script

> *(prendre la douchette en main)*
>
> Elle prend trois paquets de café, un thé, et un pot de miel.
>
> ***(SCAN — bip, bip, bip, bip, bip. Ne rien dire. Laisser le panier se remplir à l'écran.)***
>
> Je n'ai pas touché le clavier. La douchette lit la référence, StockS retrouve le produit, son prix, son stock restant.
>
> *(rechercher la cliente)*
>
> Cette cliente-là est fidèle. Sarah la retrouve, et son solde de points s'affiche.
>
> *(montrer le panier du doigt — APRÈS l'apparition de la remise)*
>
> Et regardez cette ligne, qui vient d'apparaître toute seule. Le moteur de promotions a vu que le panier dépassait le seuil que Sarah a configuré. Remise appliquée. Personne n'a eu à y penser.
>
> *(paiement)*
>
> Elle paie en espèces, elle me tend cinquante euros.
>
> *(saisir le montant reçu)*
>
> Le rendu de monnaie est calculé.
>
> *(valider — silence, attendre la confirmation)*
>
> Une validation. La vente est enregistrée, le stock est décrémenté, les points sont crédités.
>
> *(silence — 2 secondes)*
>
> Dans un tableur, ça, c'est trois fichiers et dix minutes.

### Notes de jeu

- **NE PAS PARLER PENDANT LES SCANS.** Le conseil le plus important de la démo. Cinq bips dans le silence valent mieux que n'importe quelle phrase. L'erreur du débutant est de commenter par-dessus son propre effet. On scanne, on se tait, on regarde l'écran avec le public. Puis « Je n'ai pas touché le clavier » — au passé, une fois que c'est fait.
- **Attendre que la promotion apparaisse avant de la pointer.** Le recalcul a un debounce de 400 ms après le dernier changement du panier. Pointer trop tôt = montrer du vide.
- **Ne pas zoomer sur les marges.** Le prix affiché est le `buying_price` (l'app vend au prix d'achat, pas de prix de vente dans le modèle `Product`). Invisible si on ne s'y attarde pas.
- **« Dans un tableur »** = seconde et dernière mention du concurrent, comme promis à l'acte 1.

### Pièges matériels

1. **Tester tous les codes-barres la veille.** Chaque produit physique doit avoir sa `reference` en base. Un produit non trouvé au scan = la démo s'arrête net, en public, sur le geste le plus important.
2. **Ne JAMAIS scanner un 4ᵉ café.** Le backend rejette **la commande entière** en 422 `INSUFFICIENT_STOCK` (`orders/handlers.rs:147-160`). Pas une ligne : la commande.
3. **Créer la cliente fidèle à l'avance, avec des points.** La création à la volée existe mais coûte 20 s de formulaire pour un bénéfice nul.

### Plan B

Si un code-barres ne passe pas : **ne pas le rescanner trois fois.** Basculer immédiatement sur le champ de recherche manuelle, taper 3 lettres, sélectionner. Ne pas commenter, ne pas expliquer, ne pas s'excuser. Enchaîner sur « Je n'ai pas touché le clavier » — qui reste vrai pour les autres.

---

# ACTE 4 — La conséquence

**Durée : 0:48 · 76 mots parlés (34 s) + navigation, chargements, silences (14 s)**
**⏱ Cumul à la fin de l'acte 4 : 3:50**

### Deux écrans, dans cet ordre : Inventory → Insights

| Écran | Rôle |
|---|---|
| **Inventory** | La **preuve en direct** — stock à zéro, on vient de le faire tomber |
| **Insights** | Le **diagnostic** — voilà ce que cette rupture change |

Les deux réagissent immédiatement : le backend bascule le statut en `out_of_stock` à la vente, et Insights recalcule son donut et son ABC côté navigateur à chaque chargement. **Aucune dépendance au batch.**

### ⚠️ Piège Insights : ne JAMAIS dire que le café est en classe A

L'ABC d'Insights classe par **valeur immobilisée** = `buying_price × stock_quantity`. Le café vient de tomber à 0 → valeur 0 → **dernier du classement, classe C**. Le désigner comme classe A, c'est être contredit par son propre écran.

→ Parler de l'ABC **en général** (« vingt pour cent des références portent l'essentiel de la valeur ») et laisser le café apparaître dans le **tableau des produits à risque** en dessous (qui filtre `stock < 15` et trie par `buying_price` desc, top 5).

### Script

> Ce paquet que je viens de vendre, c'était le dernier.
>
> *(Inventory — chercher le café)*
>
> Stock : zéro. Statut : rupture. Personne n'a rien saisi. La vente a suffi.
>
> *(Insights)*
>
> Et voilà ce que ça change. Une rupture de plus dans la santé du stock. Ici, StockS classe les références par valeur immobilisée — vingt pour cent d'entre elles portent l'essentiel du stock de Sarah. C'est du calcul. Immédiat, explicable, aucune boîte noire.
>
> *(descendre sur le tableau des produits à risque)*
>
> Et en bas, les produits critiques. Le café, en tête.

### Notes de jeu

- **La première phrase se dit le paquet à la main, avant de toucher la souris.** On ne l'a pas reposé depuis la caisse. C'est l'objet physique qui fait le lien. Le dire en cliquant, c'est en faire une légende de capture d'écran.
- **« C'est du calcul. Immédiat, explicable, aucune boîte noire. »** Cette phrase protège : on dit explicitement qu'Insights n'est pas de l'IA, à un moment où personne ne le demande. Devant un examinateur qui connaît le code, c'est de la crédibilité gratuite — et ça rend l'acte 5 plus fort par contraste.

### Charnière vers l'acte 5

> « Sarah clique. Et le système lui dit quoi faire. »

*(On clique sur le café depuis le tableau des produits critiques — le lien `ProductKpiLink` existe déjà.)*

---

# ACTE 5 — La décision

**Durée : 1:09 · 80 mots parlés (36 s) + clic, saisie, streaming, silences (33 s)**
**⏱ Cumul à la fin de l'acte 5 : 4:59**

Deux temps : la page KPI du produit tient la promesse de l'acte 1, puis l'assistant IA est le seul et unique moment où l'on prononce le mot « IA ».

### Pourquoi la page KPI produit remplace `/predictions`

`/inventory/:id/kpis` affiche la **date de rupture estimée**, le **point de commande optimal**, la **quantité de réappro recommandée**, les **jours de couverture** et le **statut d'alerte**. Tout est calculé en direct par le backend Rust à partir des ventes réelles.

Ce sont des **heuristiques**, pas du ML. Mais c'est calculé, c'est réel, c'est instantané — et ça tient exactement la promesse de l'acte 1 : « la commande fournisseur que le système va préparer tout seul ».

⚠️ **Ne pas dire « IA » sur cet écran.** Le seul moment d'IA de la démo, c'est l'assistant.

### Le choix de la question à l'assistant

❌ « Combien de cafés dois-je commander ? » → exige un raisonnement, l'assistant peut se perdre.
✅ **« Quels produits sont en rupture aujourd'hui ? »** → factuel, l'outil va chercher la donnée, et **le café sera dans la réponse**. Le fil rouge se referme par la bouche du modèle.

### Script

> *(clic sur le café → page KPI produit)*
>
> Sarah clique. Et le système lui dit quoi faire.
>
> *(pointer les chiffres, un par un)*
>
> Date de rupture estimée. Point de commande. Quantité recommandée. Jours de couverture.
>
> Sa commande fournisseur est prête. Elle n'a plus qu'à l'envoyer.
>
> *(ouvrir l'assistant — widget flottant, PAS la page /ai-assistant)*
>
> Mais Sarah n'a pas le temps de lire des tableaux. Alors elle demande.
>
> *(taper)* « Quels produits sont en rupture aujourd'hui ? »
>
> *(le streaming démarre — parler PENDANT que « Recherche… » défile)*
>
> Là, c'est un vrai modèle de langage, branché sur les données de son commerce. Il ne récite pas un catalogue : il cherche, il interroge, il répond.
>
> *(se taire pour la fin de la réponse)*
>
> Le café.

### Notes de jeu

- **« Sa commande fournisseur est prête. Elle n'a plus qu'à l'envoyer. »** Le verbe est **préparer**, pas **passer** — l'app ne passe pas de commande fournisseur. C'est le contrat de l'acte 1, tenu au mot près.
- **Ouvrir l'assistant via le widget flottant**, présent sur toutes les pages. Naviguer vers `/ai-assistant` coûterait un chargement et ferait perdre le décor de la page KPI derrière la conversation.
- **Parler PENDANT le streaming, pas avant.** 18 secondes de silence total, c'est trop long. La phrase commente exactement ce qui se passe à l'écran. Puis se taire pour la fin de la réponse.
- **« Le café. »** Deux mots, en dernier. La boucle se referme, et c'est le modèle qui l'a fermée.

### Plan B (indispensable)

**Sur la page KPI** : si les chiffres s'affichent en tirets (pas assez d'historique de ventes sur le café), ne pas la montrer. Rester sur Insights, dire « le café, en tête des produits critiques », et passer directement à l'assistant. → **C'est l'étape 4 de la checklist : à vérifier la veille.**

**Sur l'assistant** : seul moment dont on ne contrôle pas la sortie.

1. **Tester la question exacte, trois fois de suite, avant la démo.** Si la réponse est stable, la garder. Sinon, basculer sur plus factuel : « Combien de produits sont en rupture ? »
2. **Si ça échoue en direct : ne JAMAIS relancer une deuxième fois.** Fermer le chat, enchaîner sur « Et si l'assistant hésite, les données, elles, ne mentent pas. » Revenir sur la page KPI, reprendre le paquet, passer à la clôture.

> Le risque vaut la peine d'être pris : un streaming en direct sur les vraies données du commerce, c'est le seul moment de la démo qui ne peut pas être truqué, et tout le monde dans la salle le sait.

---

# CLÔTURE

**Durée : 33 s · 31 mots parlés (14 s) + silences et CTA (19 s)**
**⏱ Total de la démo : 6:12** *(48 s de marge sur les 7 minutes)*

### ⚠️ Le verbe « préparer », pas « passer »

L'acte 1 promet « la commande fournisseur que le système va **préparer** tout seul ». L'app ne *passe* pas de commande fournisseur, elle en recommande la quantité exacte. « Préparer » est vrai, « passer » serait un mensonge — et offrirait la question la plus facile de la soutenance.

### Script

> *(reprendre le paquet de café dans la main)*
>
> Scanné. Vendu. Le stock à zéro. L'alerte, levée avant la vente. Et la commande fournisseur, prête.
>
> *(silence — 2 secondes)*
>
> Sept minutes. Sarah, elle, n'a rien fait d'autre que passer un produit devant une douchette.
>
> *(silence — 2 secondes, puis le CTA)*

### Pourquoi l'énumération marche

Cinq fragments, cinq actes. On ne résume pas la démo, on la **rejoue en cinq secondes** : chaque mot réveille une image que le public vient de voir. Aucun verbe conjugué — on ne raconte plus, on constate.

La dernière phrase fait le reste : tout ce qui a été montré (ML, streaming, graphiques) se résume à un geste que n'importe qui peut faire. **On ne vend pas de la technologie, on vend de la simplicité qui repose sur de la technologie.**

### Le CTA — recommandation : la question retournée, puis le prix

> *(poser le paquet)*
> « Combien de ruptures avez-vous eues le mois dernier ? »
> *(silence)*
> « Vous ne savez pas. C'est exactement le problème. »
> *(retour sur la landing, section Tarifs)*

On rend le problème à l'interlocuteur au lieu de lui vendre une solution. Le silence s'installe, et le prix arrive dans ce silence. On termine sur le seul écran que le prof avait déjà vu — mais qu'il regarde différemment. La landing en décor au début, la landing en prix à la fin : le cadre est refermé.

**Alternative écartée** : « Donnez-moi votre catalogue, dans une heure votre stock est dedans. » Le plus commercial, mais il invite la question « concrètement, comment on importe ? », à laquelle l'app ne répond pas.

---

# RÉCAPITULATIF DU MINUTAGE

| Acte | Mots | Parole | Durée réelle | Cumul |
|---|---|---|---|---|
| 1. Le problème | 72 | 32 s | **0:36** | 0:36 |
| 2. La routine | 82 | 36 s | **0:53** | 1:29 |
| 3. Le geste | 118 | 52 s | **1:33** | 3:02 |
| 4. La conséquence | 76 | 34 s | **0:48** | 3:50 |
| 5. La décision | 80 | 36 s | **1:09** | 4:59 |
| Clôture | 31 | 14 s | **0:33** | **5:32** |
| **Total** | **459** | **3:24** | **5:32** | *1:28 de marge* |

### Comment employer les 1:28 de marge

**Ne pas ajouter d'écran.** Ralentir. À 5:32 sur 7 minutes, tu peux allonger chaque silence, laisser les pages respirer, et parler à 120 mots/min au lieu de 135. Une démo qui finit à 6:30 sans jamais courir vaut mieux qu'une démo à 5:32 qui enchaîne.

Si tu veux vraiment un écran de plus, prends **la facture PDF** depuis `/orders` (30 s, `useExportInvoice.ts`) — c'est un export réel, il s'ouvre et s'imprime. À placer entre l'acte 3 et l'acte 4.

### Points de contrôle au chrono

- **Fin acte 1 : 35-40 s.** Si 27 s → tu es à 160 mots/min, tu accélères sous le stress. Ralentis sur l'acte 2.
- **Fin acte 3 : ~3:00.** C'est le point de non-retour du fil rouge.
- **Fin acte 5 : ~5:00.** Il reste 2 minutes pour une clôture qui en demande 33 s. Tu peux respirer.

### Les 3 règles absolues

1. **Ne pas parler pendant les scans** (acte 3).
2. **Ne jamais dire « IA » ailleurs que sur l'assistant.** Ni Insights, ni la page KPI produit, ni le bandeau de `/predictions`.
3. **Ne jamais signaler ce qui n'a pas marché.** Pas de « normalement il y a… », pas de seconde tentative, pas d'excuse.
