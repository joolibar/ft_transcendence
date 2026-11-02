#!/bin/sh
# Creates a self-signed TLS certificate on first start if none is mounted.
# Browsers will show a warning for it; that is expected for local use.
set -e
CERT_DIR=/etc/nginx/certs
if [ ! -f "$CERT_DIR/miga.crt" ]; then
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
    -keyout "$CERT_DIR/miga.key" -out "$CERT_DIR/miga.crt" \
    -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
  echo "Generated self-signed certificate in $CERT_DIR"
fi
