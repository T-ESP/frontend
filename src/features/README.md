# 📁 features

Architecture modulaire orientée "feature/domain driven".

Chaque sous-dossier représente une **fonctionnalité métier** (ex : `auth`, `dashboard`, `users`).

Exemple dans `features/auth/` :
- `components/` → composants spécifiques à Auth
- `hooks/` → hooks métier liés à Auth
- `api.ts` → fonctions de requêtes pour l’authentification
- `slice.ts` ou `store.ts` → store local à la feature (Zustand, Redux...)

📦 Avantage :
- Code isolé, facilement maintenable, testable et scalable.