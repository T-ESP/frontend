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
| 2. La routine | 1:00 | Login → récap auto → dashboard | L'information vient à Sarah |
| 3. Le geste | 2:00 | Scan, fidélité, promo auto, monnaie | Un geste, quatre actions |
| 4. La prédiction confirmée | 1:15 | Inventory en rupture → alerte antérieure | Le modèle avait prévu |
| 5. L'anticipation | 1:45 | Predictions → assistant IA | Sarah ne commande plus au feeling |
| 6. Clôture | 0:30 | Retour au paquet | Contrat rempli |

### Les quatre charnières

Ce sont les phrases de passage. Elles constituent la vraie trame — à apprendre par cœur, le reste peut s'improviser.

1. **Routine → geste** : « Neuf heures. La première cliente entre. » *(passage au présent)*
2. **Geste → conséquence** : « Ce paquet que je viens de vendre, c'était le dernier. Regardez. » *(la plus importante)*
3. **Conséquence → anticipation** : « Le modèle avait raison sur le café. Alors qu'est-ce qu'il dit du reste ? »
4. **Anticipation → clôture** : reprendre le paquet en main. Le geste annonce la fin avant les mots.

### Modules traversés sans jamais faire le tour du propriétaire

Caisse, scan matériel, stock, fidélité, promotions, commandes, alertes, KPIs, ML, chatbot. Dix briques, aucune présentée comme une brique.

### Banc de touche (pour les questions)

Multi-magasin par sous-domaine · gestion des employés · export de facture PDF · KPIs par commande · export CSV.

### Pages à ne JAMAIS ouvrir

`/clients` (données en dur, boutons morts) · `/settings` (maquette statique) · `/playground` (route non protégée).

---

## Vérifications techniques (faites, code à l'appui)

### Ce qui marche vraiment

- **Le récap quotidien s'ouvre tout seul.** `AppLayout.tsx:33` monte `<DailyRecap />`. Il se déclenche dès que l'email est présent après login.
- **La vente décrémente le stock.** `orders/handlers.rs:296-320` : `UPDATE products_pro SET stock_quantity_pro = stock_quantity_pro - $1` par ligne, dans la transaction. Bascule le statut en `out_of_stock` à zéro.
- **Caisse** : scan par code-barres, fidélité (points réels), promotions auto (`POST /discounts/check`), rendu de monnaie — tout est réel et branché.
- **Insights** réagit en direct : donut et ABC recalculés côté navigateur à chaque chargement.

### Les pièges

- **L'alerte n'apparaît PAS en direct.** `/alerts` fait un `SELECT` sur la table `notifications` (`alerts/services.rs:17-52`), remplie **par le batch Python**, cron `0 2 * * *` (`scheduler.py:44-47`). Vendre un produit n'écrit rien dans `notifications`.
  → **Solution** : préparer l'alerte AVANT via `POST /ai/run` (port 8001, `main.py:36-55`), et ne pas ouvrir `/alerts` avant d'avoir simulé la vente.
- **Le message d'alerte est en anglais**, écrit en dur : `Stock will run out in ~2 days. Recommend ordering 30 units.` (`demand_forecast_handler.py:81-83`). Il ne passe pas par i18n.
- **L'alerte n'est créée que si l'urgence est `URGENT` ou `HIGH`** (`demand_forecast_handler.py:73`). Dépend de `days_until_stockout`, donc du stock et de l'historique de ventes.
- **`/alerts` n'affiche pas le stock courant**, juste le message figé du batch. C'est `/inventory` qui porte la preuve du zéro en direct. → **Inventory d'abord, Alerts ensuite.**
- **Un café sans forecast n'apparaît nulle part.** La vue `v_urgent_restocks` fait un `INNER JOIN` sur `demand_forecasts` et exige `forecast_date >= NOW() - 1 day` (`tenant_schema.sql:553-564`). Un forecast d'avant-hier ne compte pas.
- **Scanner une unité de trop = erreur 422** `INSUFFICIENT_STOCK` (`orders/handlers.rs:147-160`).
- **Le ticket email passe par SendGrid, pas SMTP.** Sans `SENDGRID_API_KEY`, toast d'erreur rouge en pleine caisse (`common/email.rs:12-44`). ⚠️ **À vérifier.**
- **Insights n'utilise AUCUNE IA.** Trois `if` avec seuils en dur + un tri, calculés dans le navigateur. Le vrai ML (sklearn, `.pkl`) ne remonte à l'écran que sur `/predictions`, `/alerts` et le chatbot. **Ne jamais dire « IA » sur Insights.**

---

## Checklist de préparation (le matin même)

1. Créer des commandes datées **d'hier** et **d'avant-hier** (sinon pas de récap, pas de badge de croissance).
2. Donner au café un **historique de ventes** + un **stock très bas** (urgence `URGENT`/`HIGH`).
3. Lancer `POST /ai/run` (port 8001) → génère forecast + notification.
4. Vérifier que le café apparaît dans `/alerts` **et** dans les réappros de `/predictions`.
5. Vider `localStorage` → clé `stocks:daily-recap:<email>` (sinon le récap ne se rouvre pas).
6. **Ne plus se reconnecter avant la démo.**
7. Vérifier `SENDGRID_API_KEY` — sinon retirer le geste « ticket par email » de l'acte 3.
8. Compter le stock exact du café = nombre d'unités qu'on va scanner. **Toute la trame repose sur ce chiffre.**
9. Landing déjà affichée à l'écran avant de prendre la parole.

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

### ⚠️ Piège : ne pas scroller le dashboard

Le dashboard contient un **AlertsWidget** alimenté par la même table `notifications` que `/alerts`. **L'alerte café préparée le matin y sera déjà visible.** Scroller = griller la révélation de l'acte 4 quatre minutes trop tôt.
→ **Rester en haut du dashboard.**

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

# ACTE 4 — La prédiction confirmée

**Durée : 1:12 · 108 mots parlés (48 s) + navigation, chargements, silences (24 s)**
**⏱ Cumul à la fin de l'acte 4 : 4:14**

### L'ordre n'est pas négociable : Inventory → Insights → Alerts

| Écran | Rôle |
|---|---|
| **Inventory** | La **preuve en direct** — stock à zéro, on vient de le faire tomber |
| **Insights** | Le **diagnostic** — voilà ce que cette rupture change |
| **Alerts** | La **révélation** — le système l'avait annoncée avant la vente |

⚠️ Inverser Inventory et Alerts = perdre la preuve. `/alerts` n'affiche **pas** le stock courant, seulement le message figé du batch. C'est Inventory qui porte le zéro.

### ⚠️ Piège Insights : ne JAMAIS dire que le café est en classe A

L'ABC d'Insights classe par **valeur immobilisée** = `buying_price × stock_quantity`. Le café vient de tomber à 0 → valeur 0 → **dernier du classement, classe C**. Le désigner comme classe A, c'est être contredit par son propre écran.

→ Parler de l'ABC **en général** (« vingt pour cent des références portent l'essentiel de la valeur ») et laisser le café apparaître dans le **tableau des produits à risque** en dessous (qui filtre `stock < 15` et trie par `buying_price` desc, top 5).
→ **Prep** : donner au café un prix d'achat supérieur aux autres produits en stock bas, pour qu'il soit en tête de ce tableau.

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
>
> *(Alerts)*
>
> Maintenant, regardez l'heure de cette alerte.
>
> *(pointer la date)*
>
> Elle a été levée avant que j'ouvre la caisse. Le modèle avait prévu la rupture pour dans deux jours.
>
> *(silence — 2 secondes)*
>
> Ce matin, une seule cliente a suffi.

### Notes de jeu

- **La première phrase se dit le paquet à la main, avant de toucher la souris.** On ne l'a pas reposé depuis la caisse. C'est l'objet physique qui fait le lien. Le dire en cliquant, c'est en faire une légende de capture d'écran.
- **Ne pas lire le message d'alerte à voix haute** (il est en anglais). Pointer la **date**, traduire soi-même : « rupture prévue dans deux jours ». Ce que le public doit lire, c'est l'horodatage.
- **« C'est du calcul. Immédiat, explicable, aucune boîte noire. »** Cette phrase protège : on dit explicitement qu'Insights n'est pas de l'IA, à un moment où personne ne le demande. Devant un examinateur qui connaît le code, c'est de la crédibilité gratuite — et ça rend l'acte 5 plus fort par contraste.
- **Le silence avant « Ce matin, une seule cliente a suffi. »** C'est la meilleure phrase des 7 minutes : le modèle avait raison, la réalité va plus vite que les modèles, et Sarah était prévenue dans les deux cas. Ne pas l'enchaîner, ne pas la commenter, ne pas l'expliquer.

### Charnière vers l'acte 5

> « Le modèle avait raison sur le café. Alors qu'est-ce qu'il dit du reste ? »

### Plan B

**L'acte le plus fragile** — il dépend entièrement du batch lancé le matin. Si l'alerte n'est pas là (batch non lancé, urgence `MEDIUM`, forecast trop vieux) : **ne pas ouvrir `/alerts` du tout.**

Terminer sur le tableau des produits critiques d'Insights : « Le café, en tête. Et Sarah le sait depuis ce matin. » Puis enchaîner sur Predictions. On perd la plus belle phrase, on ne perd pas la démo.

→ C'est pourquoi l'étape 4 de la checklist (vérifier que le café est dans `/alerts` **avant** de commencer) n'est pas optionnelle.

---

# ACTE 5 — L'anticipation

**Durée : 1:25 · 104 mots parlés (46 s) + chargement, saisie, streaming, silences (39 s)**
**⏱ Cumul à la fin de l'acte 5 : 5:39**

Le seul acte où l'on prend un risque assumé, et le seul où l'on peut dire « IA » sans mentir.

### ⚠️ Le « stock actuel » de la carte réappro affichera 3, pas 0

`v_urgent_restocks` prend `df.current_stock` depuis **`demand_forecasts`** (snapshot du batch), pas depuis `products_pro` (`tenant_schema.sql:553-564`). Inventory vient d'afficher 0.

→ **Nommer la contradiction avant qu'on la pose.** C'est la preuve matérielle que le modèle a tourné avant la vente — cohérent avec l'acte 4.
→ Si on objecte « vos données sont périmées » : le batch tourne chaque nuit, et c'est le bon rythme. **On ne passe pas une commande fournisseur toutes les cinq minutes.**

### Le choix de la question à l'assistant

❌ « Combien de cafés dois-je commander ? » → exige un raisonnement sur le forecast, l'assistant peut se perdre.
✅ **« Quels produits sont en rupture aujourd'hui ? »** → factuel, l'outil va chercher la donnée, et **le café sera dans la réponse**. Le fil rouge se referme par la bouche du modèle.

### Script

> *(Predictions)*
>
> Le modèle avait raison sur le café. Alors qu'est-ce qu'il dit du reste ?
>
> *(balayer la page du regard, sans s'arrêter)*
>
> Prévision de la demande, produits à recommander en priorité, scoring des fournisseurs, anomalies de prix.
>
> *(pointer la carte des réappros urgents)*
>
> Le café. Urgence critique. Et la quantité exacte à commander.
>
> Ce stock affiché, trois, c'est celui du moment où le modèle a tourné, ce matin. Depuis, je les ai vendus.
>
> *(ouvrir l'assistant — widget flottant, PAS la page /ai-assistant)*
>
> Mais Sarah n'a pas le temps de lire des graphiques. Alors elle demande.
>
> *(taper)* « Quels produits sont en rupture aujourd'hui ? »
>
> *(le streaming démarre — parler PENDANT que « Recherche… » défile)*
>
> Il interroge les données de son commerce, en direct. Ce n'est pas un chatbot qui récite un catalogue. Il cherche, et il répond.
>
> *(se taire pour la fin de la réponse)*
>
> Le café.

### Notes de jeu

- **Ouvrir l'assistant depuis Predictions, via le widget flottant.** Il est présent sur toutes les pages. Naviguer vers `/ai-assistant` coûterait un chargement et ferait perdre le décor des prédictions derrière la conversation.
- **Parler PENDANT le streaming, pas avant.** 18 secondes de silence total, c'est trop long. La phrase « Il interroge les données de son commerce, en direct » commente exactement ce qui se passe à l'écran. Puis se taire pour la fin de la réponse.
- **Ne pas balayer toute la page Predictions.** Nommer les quatre modules en une phrase, ne s'arrêter que sur la carte des réappros urgents. Le reste est un décor qui prouve la profondeur sans coûter de temps.
- **« Le café. »** Deux mots, en dernier. La boucle se referme, et c'est le modèle qui l'a fermée.

### Plan B (indispensable)

Seul acte dont on ne contrôle pas la sortie. Trois façons de tomber : l'assistant est lent, il se trompe, ou il ne mentionne pas le café.

1. **Tester la question exacte le matin même, trois fois de suite.** Si la réponse est stable, la garder. Sinon, basculer sur plus factuel encore : « Combien de produits sont en rupture ? »
2. **Si ça échoue en direct : ne JAMAIS relancer une deuxième fois.** Fermer le chat, enchaîner sur « Et si l'assistant hésite, les données, elles, ne mentent pas. » Revenir sur la carte des réappros urgents, reprendre le paquet, passer à la clôture.

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
| 4. La prédiction confirmée | 108 | 48 s | **1:12** | 4:14 |
| 5. L'anticipation | 104 | 46 s | **1:25** | 5:39 |
| Clôture | 31 | 14 s | **0:33** | **6:12** |
| **Total** | **515** | **3:48** | **6:12** | *48 s de marge* |

### Points de contrôle au chrono

- **Fin acte 1 : 35-40 s.** Si 27 s → tu es à 160 mots/min, tu accélères sous le stress. Ralentis sur l'acte 2.
- **Fin acte 3 : ~3:00.** C'est le point de non-retour. Si tu es à 3:45, coupe Insights à l'acte 4 et va directement d'Inventory à Alerts.
- **Fin acte 5 : ~5:40.** Il reste 1:20 pour une clôture qui en demande 33 s.

### Les 3 règles absolues

1. **Ne pas parler pendant les scans** (acte 3).
2. **Ne jamais dire « IA » sur Insights** (acte 4).
3. **Ne jamais signaler ce qui n'a pas marché.** Pas de « normalement il y a… », pas de seconde tentative, pas d'excuse.
