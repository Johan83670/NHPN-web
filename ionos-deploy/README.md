# Structure IONOS - DETAILLIUM

## Organisation des dossiers

Cette structure est prête pour un déploiement sur IONOS avec séparation entre :
- **Site principal** (prestations) : `detaillium.fr`
- **Boutique produits** (séparée) : `boutique.detaillium.fr`
- **Zone administration** (privée) : `detaillium.fr/admin`

```
ionos-deploy/
├── public_html/           # Site principal - Prestations
│   ├── index.html
│   ├── prestation-particulier.html
│   ├── prestation-professionel.html
│   ├── contact.html
│   ├── mentions-legales.html
│   ├── style.css
│   ├── index.js
│   ├── scriptcontact.js
│   ├── send-contact.php
│   ├── .htaccess
│   └── image index/
│
├── boutique/              # Sous-domaine boutique (site séparé)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── .htaccess
│   └── images/
│
└── admin/                 # Zone privée (protégée)
    ├── index.html
    ├── dashboard.html
    ├── style.css
    ├── admin.js
    ├── .htaccess          # Protection par mot de passe
    └── .htpasswd          # Fichier des mots de passe
```

## Configuration IONOS

### 1. Site Principal (detaillium.fr)
- Uploadez le contenu de `public_html/` à la racine de votre hébergement
- Le domaine principal pointe vers ce dossier

### 2. Sous-domaine Boutique (boutique.detaillium.fr)
1. Dans le panneau IONOS, créez un sous-domaine `boutique`
2. Associez-le au dossier `/boutique`
3. Uploadez le contenu de `boutique/`

### 3. Zone Admin Privée
1. Le dossier `admin/` est protégé par `.htaccess`
2. Modifiez le fichier `.htpasswd` avec vos identifiants
3. Pour générer un mot de passe hashé, utilisez :
   - https://www.htaccesstools.com/htpasswd-generator/
   - Ou en ligne de commande : `htpasswd -c .htpasswd votre_utilisateur`

## Mise à jour hébergeur

Dans `mentions-legales.html`, modifiez la section hébergement :
```html
<h3>Hébergement</h3>
<p>
  IONOS by 1&1<br>
  1&1 IONOS SE<br>
  Elgendorfer Str. 57, 56410 Montabaur, Allemagne<br>
  <a href="https://www.ionos.fr/">https://www.ionos.fr/</a>
</p>
```

## Sécurité

- La zone admin est protégée par authentification HTTP Basic
- Le fichier `.htpasswd` ne doit JAMAIS être accessible publiquement
- Changez les mots de passe par défaut avant la mise en production
