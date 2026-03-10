# Script PowerShell pour préparer le déploiement IONOS
# Exécuter depuis le dossier NHPN-web-master

Write-Host "=== Préparation du déploiement DETAILLIUM pour IONOS ===" -ForegroundColor Cyan
Write-Host ""

$sourceDir = $PSScriptRoot
$deployDir = Join-Path $sourceDir "ionos-deploy"

# Vérifier que le dossier ionos-deploy existe
if (-not (Test-Path $deployDir)) {
    Write-Host "Erreur: Le dossier ionos-deploy n'existe pas!" -ForegroundColor Red
    exit 1
}

Write-Host "1. Copie des fichiers du site principal..." -ForegroundColor Yellow

$publicHtml = Join-Path $deployDir "public_html"

# Copier les fichiers du site principal
$filesToCopy = @(
    "index.html",
    "prestation-particulier.html",
    "prestation-professionel.html",
    "contact.html",
    "mentions-legales.html",
    "style.css",
    "index.js",
    "scriptcontact.js",
    "send-contact.php"
)

foreach ($file in $filesToCopy) {
    $sourcePath = Join-Path $sourceDir $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination $publicHtml -Force
        Write-Host "  - Copié: $file" -ForegroundColor Green
    } else {
        Write-Host "  - Manquant: $file" -ForegroundColor Yellow
    }
}

# Copier le dossier images
$imagesSource = Join-Path $sourceDir "image index"
$imagesDest = Join-Path $publicHtml "image index"
if (Test-Path $imagesSource) {
    Copy-Item $imagesSource -Destination $imagesDest -Recurse -Force
    Write-Host "  - Copié: dossier image index" -ForegroundColor Green
}

Write-Host ""
Write-Host "2. Copie des images pour la boutique..." -ForegroundColor Yellow

$boutiqueImages = Join-Path $deployDir "boutique\images"
if (-not (Test-Path $boutiqueImages)) {
    New-Item -ItemType Directory -Path $boutiqueImages -Force | Out-Null
}

# Copier le logo et les images produits
$imagesToBoutique = @(
    "logo.png"
)

foreach ($img in $imagesToBoutique) {
    $sourcePath = Join-Path $imagesSource $img
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination $boutiqueImages -Force
        Write-Host "  - Copié: $img" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== Déploiement préparé avec succès! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Structure créée:" -ForegroundColor White
Write-Host "  ionos-deploy/" -ForegroundColor Gray
Write-Host "  ├── public_html/     -> Site principal (detaillium.fr)" -ForegroundColor Gray
Write-Host "  ├── boutique/        -> Boutique (boutique.detaillium.fr)" -ForegroundColor Gray
Write-Host "  └── admin/           -> Administration (detaillium.fr/admin)" -ForegroundColor Gray
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Uploadez public_html/ à la racine de votre hébergement IONOS"
Write-Host "2. Créez un sous-domaine 'boutique' pointant vers /boutique"
Write-Host "3. Configurez le chemin .htpasswd dans admin/.htaccess"
Write-Host "4. Générez un vrai mot de passe pour admin/.htpasswd"
Write-Host ""
Write-Host "Important: Modifiez les mentions légales avec les infos hébergeur IONOS!"
