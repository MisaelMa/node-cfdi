#!/bin/bash
# Download CFDI XML examples from GitHub repositories
# Classifies automatically by version (3.3 vs 4.0) based on namespace
# Usage: bash scripts/download-xml-examples.sh

set -e

DEST="packages/files/xml/examples"
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

mkdir -p "$DEST/cfdi33" "$DEST/cfdi40"

echo "Downloading CFDI XML examples..."
echo ""

# ─── Download all XMLs to temp ──────────────────────────────

URLS=(
  # ── eclipxe13/CfdiUtils ──
  "https://raw.githubusercontent.com/eclipxe13/CfdiUtils/master/tests/assets/cfdi40-real.xml"
  "https://raw.githubusercontent.com/eclipxe13/CfdiUtils/master/tests/assets/cfdi40-valid.xml"
  "https://raw.githubusercontent.com/eclipxe13/CfdiUtils/master/tests/assets/created-cfdi40-pago20-valid.xml"
  "https://raw.githubusercontent.com/eclipxe13/CfdiUtils/master/tests/assets/cfdi33-real.xml"
  "https://raw.githubusercontent.com/eclipxe13/CfdiUtils/master/tests/assets/cfdi33-valid.xml"

  # ── invopop/gobl.cfdi (CFDI 4.0 variados) ──
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-b2b-bare.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-b2b-full.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-b2c.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-b2c-inc.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-b2c-inc-disc.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-b2c-third-party.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-export.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-export-notax.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-global.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-ieps.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-ieps-2.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-multi-currency.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-timbre.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/credit-note.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/parse/in/invoice-b2b-full-round.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/convert/out/food-vouchers.xml"
  "https://raw.githubusercontent.com/invopop/gobl.cfdi/main/test/data/convert/out/fuel-account-balance.xml"

  # ── nodecfdi/cfdi-validator (pagos, descuentos) ──
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/cfdi40-real.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/cfdi40-valid.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/created-with-discounts-40.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/created-with-discounts-33.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/created-pago-with-ns-at-root-33.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/cfdi33-real.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/cfdi33-valid.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/pagos10/sample-factura123.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/pagos10/sample-facturador01.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-validator/main/tests/_files/pagos10/sample-validacfd01.xml"

  # ── nodecfdi/cfdi-expresiones ──
  "https://raw.githubusercontent.com/nodecfdi/cfdi-expresiones/main/tests/_files/cfdi40-real.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-expresiones/main/tests/_files/cfdi33-real.xml"

  # ── nodecfdi/cfdi-to-json ──
  "https://raw.githubusercontent.com/nodecfdi/cfdi-to-json/main/tests/_files/cfdi-example.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-to-json/main/tests/_files/detallista-example.xml"

  # ── nodecfdi/cfdi-to-pdf ──
  "https://raw.githubusercontent.com/nodecfdi/cfdi-to-pdf/main/tests/_files/cfdi33-valid.xml"
  "https://raw.githubusercontent.com/nodecfdi/cfdi-to-pdf/main/tests/_files/cfdi33-payment-valid.xml"

  # ── nodecfdi/cfdi-core ──
  "https://raw.githubusercontent.com/nodecfdi/cfdi-core/main/tests/_files/cfdi33.xml"

  # ── eclipxe13/buzoncfdi-cfdireader (CFDI 3.3 con timbre) ──
  "https://raw.githubusercontent.com/eclipxe13/buzoncfdi-cfdireader/master/tests/assets/v33/valid.xml"
  "https://raw.githubusercontent.com/eclipxe13/buzoncfdi-cfdireader/master/tests/assets/v33/valid-without-timbre.xml"

  # ── nodecfdi/sat-ws-descarga-masiva ──
  "https://raw.githubusercontent.com/nodecfdi/sat-ws-descarga-masiva/main/tests/_files/zip/cfdi.xml"
)

COUNTER=0
for url in "${URLS[@]}"; do
  filename=$(basename "$url")
  # Create unique name: repo-path-filename
  repo=$(echo "$url" | sed -E 's|https://raw.githubusercontent.com/[^/]+/([^/]+)/.*|\1|')
  # For files in subdirs, include parent dir
  parent=$(echo "$url" | sed -E 's|.*/([^/]+)/[^/]+\.xml$|\1|')
  if [ "$parent" = "_files" ] || [ "$parent" = "assets" ] || [ "$parent" = "in" ] || [ "$parent" = "out" ]; then
    parent=""
  fi
  dest_name="${repo}${parent:+-$parent}-${filename}"

  if curl -sfL "$url" -o "$TMP_DIR/$dest_name" 2>/dev/null; then
    COUNTER=$((COUNTER + 1))
    echo "  ✔ $dest_name"
  else
    echo "  ✗ $dest_name (failed)"
  fi
done

echo ""
echo "Downloaded $COUNTER files. Classifying by version..."
echo ""

# ─── Classify by CFDI version (namespace-based) ─────────────

COUNT_40=0
COUNT_33=0

for file in "$TMP_DIR"/*.xml; do
  [ -f "$file" ] || continue
  [ -s "$file" ] || continue
  filename=$(basename "$file")

  if grep -q 'xmlns:cfdi="http://www.sat.gob.mx/cfd/4"' "$file" 2>/dev/null || \
     grep -q "xmlns:cfdi='http://www.sat.gob.mx/cfd/4'" "$file" 2>/dev/null || \
     grep -q 'xmlns="http://www.sat.gob.mx/cfd/4"' "$file" 2>/dev/null; then
    cp "$file" "$DEST/cfdi40/$filename"
    echo "  4.0 → $filename"
    COUNT_40=$((COUNT_40 + 1))
  elif grep -q 'xmlns:cfdi="http://www.sat.gob.mx/cfd/3"' "$file" 2>/dev/null || \
       grep -q "xmlns:cfdi='http://www.sat.gob.mx/cfd/3'" "$file" 2>/dev/null || \
       grep -q 'xmlns="http://www.sat.gob.mx/cfd/3"' "$file" 2>/dev/null; then
    cp "$file" "$DEST/cfdi33/$filename"
    echo "  3.3 → $filename"
    COUNT_33=$((COUNT_33 + 1))
  else
    echo "  --- → $filename (not CFDI, skipped)"
  fi
done

# ─── Summary ────────────────────────────────────────────────

echo ""
echo "=== CFDI 4.0 ($COUNT_40 files) ==="
ls -1 "$DEST/cfdi40/" 2>/dev/null || echo "(empty)"

echo ""
echo "=== CFDI 3.3 ($COUNT_33 files) ==="
ls -1 "$DEST/cfdi33/" 2>/dev/null || echo "(empty)"

echo ""
echo "Total: $COUNT_40 CFDI 4.0 + $COUNT_33 CFDI 3.3 = $((COUNT_40 + COUNT_33)) files in $DEST"
