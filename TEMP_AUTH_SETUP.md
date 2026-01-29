# Temporary Auth Setup

Pour débloquer les KPIs en attendant l'implémentation complète de l'auth :

## Option 1: Token manuel dans le navigateur

1. Obtenir un token du backend :
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password"}' \
  | jq -r '.data.token'
```

2. Dans la console du navigateur (F12):
```javascript
localStorage.setItem('auth_token', 'YOUR_TOKEN_HERE')
```

3. Rafraîchir la page

## Option 2: Auto-login (dev only)

Ajouter dans `App.tsx` ou au démarrage:
```typescript
// DEV ONLY - Remove in production
if (import.meta.env.DEV && !localStorage.getItem('auth_token')) {
  localStorage.setItem('auth_token', 'YOUR_TOKEN_HERE');
}
```

## TODO: Implémenter l'authentification complète
- [ ] LoginForm avec logique de soumission
- [ ] Appel API /auth/login
- [ ] Stockage du token dans localStorage
- [ ] Context/Provider pour auth state
- [ ] Redirection après login
- [ ] Logout qui clear le token
