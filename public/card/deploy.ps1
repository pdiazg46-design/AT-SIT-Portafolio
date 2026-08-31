# =========================================================
# VentoCard Automatic Cloud Deployment Script (AT-SIT / Vercel)
# =========================================================
Write-Host "🚀 Iniciando despliegue de VentoCard v1.7.0..." -ForegroundColor Cyan

$sourceDir = "c:\Users\pdiaz\Desarrollos\Contactos ATSIT"
$targetDir = "C:\Users\pdiaz\Desarrollos\Pagina WEB\public\card"
$targetProject = "C:\Users\pdiaz\Desarrollos\Pagina WEB"

# 1. Empaquetar ZIP
Write-Host "📦 Generando paquete de despliegue..." -ForegroundColor Yellow
Compress-Archive -Path "$sourceDir\index.html", "$sourceDir\sw.js", "$sourceDir\manifest.json", "$sourceDir\jsqr.min.js", "$sourceDir\favicon.png", "$sourceDir\apple-touch-icon.png", "$sourceDir\icon.svg", "$sourceDir\icon-192.png", "$sourceDir\icon-512.png", "$sourceDir\icon-maskable-192.png", "$sourceDir\icon-maskable-512.png", "$sourceDir\README.md" -DestinationPath "$sourceDir\VentoCard_ATSIT_Deploy.zip" -Force

# 2. Copiar archivos al portal corporativo (Next.js / Vercel)
Write-Host "📂 Sincronizando con Pagina WEB (public/card)..." -ForegroundColor Yellow
Copy-Item -Path "$sourceDir\*" -Destination $targetDir -Recurse -Force

# 3. Git Push en Contactos ATSIT
Set-Location $sourceDir
git add index.html sw.js VentoCard_ATSIT_Deploy.zip
git commit -m "feat(deploy): update VentoCard"
git push origin main

# 4. Git Push en Pagina WEB (Despliegue automático en Vercel)
Set-Location $targetProject
git add public/card
git commit -m "deploy: update VentoCard on atsit.cl/card"
git push origin main

Write-Host "✅ ¡Despliegue completado con éxito en https://atsit.cl/card!" -ForegroundColor Green
