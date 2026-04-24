#!/bin/bash
# =============================================================================
# Setup Trusted Publishing para todos los paquetes @cfdi, @clir y @saxon-he
# Repository: MisaelMa/node-cfdi
# =============================================================================
# Requisitos:
#   - npm >= 11.10.0  →  npm install -g npm@latest
#   - Estar logueado  →  npm whoami
#   - 2FA habilitado en tu cuenta de npm
# =============================================================================

set -euo pipefail

REPO="MisaelMa/node-cfdi"

PACKAGES=(
  "@cfdi/xml"
  "@cfdi/complementos"
  "@cfdi/xsd"
  "@cfdi/csd"
  "@cfdi/csf"
  "@cfdi/catalogos"
  "@cfdi/utils"
  "@cfdi/rfc"
  "@cfdi/types"
  "@cfdi/transform"
  "@cfdi/2json"
  "@cfdi/expresiones"
  "@cfdi/elements"
  "@clir/openssl"
  "@saxon-he/cli"
)

WORKFLOWS=("publish.yml")

echo "============================================="
echo "  Trusted Publishing Setup - node-cfdi"
echo "============================================="
echo ""

# ---- Verificar npm >= 11.10.0 ----
NPM_VERSION=$(npm --version)
NPM_MAJOR=$(echo "$NPM_VERSION" | cut -d. -f1)
NPM_MINOR=$(echo "$NPM_VERSION" | cut -d. -f2)

if [ "$NPM_MAJOR" -lt 11 ] || ([ "$NPM_MAJOR" -eq 11 ] && [ "$NPM_MINOR" -lt 10 ]); then
  echo "❌ Se requiere npm >= 11.10.0 (actual: $NPM_VERSION)"
  echo "   Ejecuta: npm install -g npm@latest"
  exit 1
fi
echo "✅ npm version: $NPM_VERSION"

# ---- Verificar login ----
WHOAMI=$(npm whoami 2>/dev/null || true)
if [ -z "$WHOAMI" ]; then
  echo "❌ No estás logueado en npm. Ejecuta: npm login"
  exit 1
fi
echo "✅ Autenticado como: $WHOAMI"
echo ""

# ---- Configurar Trusted Publishing ----
TOTAL=${#PACKAGES[@]}
WORKFLOWS_COUNT=${#WORKFLOWS[@]}
SUCCESS=0
FAIL=0

for WORKFLOW in "${WORKFLOWS[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Workflow: $WORKFLOW"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  for PKG in "${PACKAGES[@]}"; do
    echo -n "  → $PKG ... "
    if npm trust github "$PKG" \
      --repository "$REPO" \
      --file "$WORKFLOW" \
      --yes 2>&1; then
      echo "✅"
      ((SUCCESS++))
    else
      echo "❌"
      ((FAIL++))
    fi
  done
  echo ""
done

# ---- Resumen ----
echo "============================================="
echo "  Resumen"
echo "============================================="
echo "  Total operaciones: $((TOTAL * WORKFLOWS_COUNT))"
echo "  Exitosas: $SUCCESS"
echo "  Fallidas: $FAIL"
echo ""

# ---- Listar configuración ----
echo "============================================="
echo "  Verificando configuración..."
echo "============================================="
echo ""

for PKG in "${PACKAGES[@]}"; do
  echo "--- $PKG ---"
  npm trust list "$PKG" 2>&1 || echo "  (no se pudo listar)"
  echo ""
done

echo "============================================="
echo "  ¡Listo!"
echo "============================================="
echo ""
echo "Próximos pasos:"
echo "  1. Actualiza tus workflows de GitHub Actions para usar"
echo "     permissions: id-token: write"
echo "  2. Cambia 'rush publish' para que use --provenance"
echo "  3. Cuando todo funcione, elimina el secret NPM_TOKEN de GitHub"
