#!/bin/bash
TOKEN="36c48cb7-4e88-4e6a-8613-73f2172a8957"
DOMAIN="ccwedding"

echo "Deploying DNS TXT record for $DOMAIN..."
# Update the TXT record with the validation string provided by Certbot
curl -s "https://www.duckdns.org/update?domains=${DOMAIN}&token=${TOKEN}&txt=${CERTBOT_VALIDATION}"

echo ""
echo "Waiting 60 seconds for DNS propagation..."
sleep 60
