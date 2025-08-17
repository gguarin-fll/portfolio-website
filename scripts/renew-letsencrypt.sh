#!/bin/bash

# Let's Encrypt Certificate Renewal Script
# This script renews Let's Encrypt certificates and reloads nginx

set -e

# Renew certificates
certbot renew --quiet

# Check if nginx is running in Docker
if docker ps | grep -q nginx; then
    container_name=$(docker ps --format "table {{.Names}}" | grep nginx | head -1)
    docker exec "$container_name" nginx -s reload
    echo "Certificate renewed and nginx reloaded"
else
    echo "Warning: Nginx container not running"
fi