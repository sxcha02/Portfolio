# 🚀 Déploiement sur Netlify

Ce guide vous aide à déployer votre portfolio sur Netlify.

## 📋 Prérequis

- Un compte GitHub (déjà configuré)
- Un compte Netlify (gratuit) : [https://www.netlify.com](https://www.netlify.com)

## 🔧 Configuration effectuée

Les fichiers suivants ont été configurés pour optimiser le déploiement :

1. **netlify.toml** : Configuration principale de Netlify
   - Dossier de publication : `portfolio`
   - Headers de sécurité
   - Optimisations CSS/JS/HTML
   - Compression d'images

2. **portfolio/_redirects** : Gestion des redirections
   - URLs propres pour les projets
   - Gestion des erreurs 404

3. **.gitignore** : Fichiers à ignorer par Git

## 🌐 Méthode 1 : Déploiement via l'interface Netlify (Recommandé)

### Étape 1 : Pousser votre code sur GitHub

```bash
git add .
git commit -m "Préparation pour déploiement Netlify"
git push origin claude/netlify-deployment-setup-01GwZMHG6ajQmLZnktibDa2b
```

### Étape 2 : Connecter à Netlify

1. Allez sur [https://app.netlify.com](https://app.netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Sélectionnez "GitHub"
4. Autorisez Netlify à accéder à vos dépôts
5. Sélectionnez votre dépôt `Portfolio`
6. Netlify détectera automatiquement la configuration depuis `netlify.toml`
7. Cliquez sur "Deploy site"

### Étape 3 : Configuration automatique

Netlify utilisera automatiquement les paramètres du fichier `netlify.toml` :
- **Publish directory** : `portfolio`
- **Build command** : (aucune, site statique)

### Étape 4 : Votre site est en ligne ! 🎉

Netlify vous donnera une URL comme : `https://random-name-123456.netlify.app`

Vous pouvez personnaliser le nom dans : Site settings → Domain management → Options → Edit site name

## 🌐 Méthode 2 : Déploiement via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter à Netlify
netlify login

# Déployer depuis le dossier racine
netlify deploy --dir=portfolio --prod
```

## 🔗 URLs propres disponibles

Grâce au fichier `_redirects`, vous pouvez accéder aux projets avec des URLs simplifiées :

- `https://votre-site.netlify.app/calculateur`
- `https://votre-site.netlify.app/meteo`
- `https://votre-site.netlify.app/cv`
- `https://votre-site.netlify.app/wiki`

## 📱 Fonctionnalités Netlify activées

✅ HTTPS automatique
✅ CDN global
✅ Optimisation des assets (CSS, JS, images)
✅ Headers de sécurité
✅ Gestion des erreurs 404
✅ Déploiement continu (chaque push met à jour le site)

## 🛠️ Mises à jour futures

Pour mettre à jour votre site :

1. Faites vos modifications localement
2. Commitez et poussez sur GitHub :
   ```bash
   git add .
   git commit -m "Description des changements"
   git push
   ```
3. Netlify redéploiera automatiquement votre site !

## 🎨 Personnalisation du domaine

Pour utiliser votre propre domaine (ex: `monportfolio.com`) :

1. Allez dans Site settings → Domain management
2. Cliquez sur "Add custom domain"
3. Suivez les instructions pour configurer votre DNS

## 📊 Analytics (optionnel)

Netlify offre des analytics basiques. Pour plus de détails, vous pouvez :
- Activer Netlify Analytics (payant)
- Ajouter Google Analytics à vos pages HTML

## 🐛 Dépannage

### Le site ne se charge pas correctement
- Vérifiez que le dossier de publication est bien `portfolio`
- Consultez les logs de déploiement dans Netlify

### Les liens ne fonctionnent pas
- Vérifiez le fichier `portfolio/_redirects`
- Assurez-vous que tous les chemins sont relatifs

### Erreur 404 sur une page
- Vérifiez que le fichier existe dans le dossier `portfolio`
- Vérifiez l'orthographe des chemins

## 📞 Support

- Documentation Netlify : [https://docs.netlify.com](https://docs.netlify.com)
- Community Forum : [https://answers.netlify.com](https://answers.netlify.com)

---

**Note** : Ce projet est configuré pour un déploiement immédiat. Tous les fichiers de configuration sont en place ! 🚀
