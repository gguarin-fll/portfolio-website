# SSL Certificate Rotation Guide

## Overview
This guide explains how to manage and rotate SSL certificates for the portfolio website. The system supports both Let's Encrypt (production) and self-signed certificates (development), with automatic rotation and renewal capabilities.

## Quick Start

### Check Certificate Status
```bash
./scripts/rotate-ssl.sh --check
```

### Force Immediate Rotation
```bash
./scripts/rotate-ssl.sh --force
```

### Setup Automated Rotation
```bash
./scripts/setup-cron.sh
```

## Certificate Types

### 1. Let's Encrypt Certificates (Recommended for Production)
For production environments with a real domain:

#### Initial Setup
```bash
# Stop nginx if running to free port 80
docker stop portfolio-website-nginx-1

# Generate certificate
certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --non-interactive \
  --agree-tos \
  --email admin@yourdomain.com

# Restart nginx
docker start portfolio-website-nginx-1
```

#### Using the Rotation Script
```bash
./scripts/rotate-ssl.sh --type letsencrypt \
  --domain yourdomain.com \
  --email admin@yourdomain.com
```

### 2. Self-Signed Certificates (Development/Testing)
For development and testing environments:
```bash
./scripts/rotate-ssl.sh --type self-signed --force
```

## Current Production Setup (gioguarin.com)

The production deployment uses Let's Encrypt certificates:
- **Domain**: gioguarin.com, www.gioguarin.com
- **Certificate Location**: `/etc/letsencrypt/live/gioguarin.com/`
- **Auto-Renewal**: Configured via cron (daily at 3 AM)
- **Nginx Config**: Points to Let's Encrypt certificates

## Features

### Automatic Expiry Detection
- Checks certificate expiry date
- Triggers rotation when < 30 days remain
- Configurable threshold

### Backup Management
- Automatic backup before rotation
- Keeps last 5 backups
- Timestamped backup files in `nginx/ssl/backup/`

### Validation & Rollback
- Validates new certificates before deployment
- Automatic rollback on failure
- Nginx configuration testing

### Zero-Downtime Rotation
- Graceful Nginx reload
- No service interruption
- Automatic container detection

## Manual Rotation Process

1. **Check current certificate**:
   ```bash
   openssl x509 -in nginx/ssl/cert.pem -text -noout | grep -A2 "Validity"
   ```

2. **Backup existing certificates**:
   ```bash
   cp nginx/ssl/cert.pem nginx/ssl/cert.pem.backup
   cp nginx/ssl/key.pem nginx/ssl/key.pem.backup
   ```

3. **Generate new certificate**:
   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout nginx/ssl/key.pem \
     -out nginx/ssl/cert.pem \
     -subj "/C=US/ST=State/L=City/O=Organization/CN=portfolio.local" \
     -addext "subjectAltName=DNS:portfolio.local,DNS:localhost,IP:127.0.0.1"
   ```

4. **Set permissions**:
   ```bash
   chmod 644 nginx/ssl/cert.pem
   chmod 600 nginx/ssl/key.pem
   ```

5. **Reload Nginx**:
   ```bash
   docker exec portfolio-website-nginx-1 nginx -s reload
   ```

## Automation

### Let's Encrypt Auto-Renewal
For Let's Encrypt certificates, a dedicated renewal script runs daily:
```bash
# Cron job (runs daily at 3:00 AM)
0 3 * * * /root/portfolio-website/scripts/renew-letsencrypt.sh

# Manual renewal
./scripts/renew-letsencrypt.sh
```

### Self-Signed Certificate Rotation
For self-signed certificates:
- **Daily check** at 2:00 AM
- **Auto-rotation** when certificate expires within 30 days

### View Logs
```bash
# SSL rotation logs
tail -f /var/log/ssl-rotation/rotation.log

# Let's Encrypt renewal logs
tail -f /var/log/letsencrypt-renewal.log

# Certbot logs
tail -f /var/log/letsencrypt/letsencrypt.log
```

### Manage Cron Jobs
```bash
# List jobs
crontab -l

# Edit jobs
crontab -e

# Remove all jobs
crontab -r
```

## Environment Variables

Configure in `.env` or export before running:

```bash
export CERT_DAYS=365              # Certificate validity period
export CERT_COUNTRY=US            # Country code
export CERT_STATE=California      # State/Province
export CERT_CITY=SanFrancisco    # City
export CERT_ORG=MyCompany         # Organization name
export CERT_CN=portfolio.local    # Common Name (domain)
export CERT_SAN="DNS:portfolio.local,DNS:www.portfolio.local,IP:10.0.0.1"
```

## Troubleshooting

### Certificate Not Loading

#### For Let's Encrypt
```bash
# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout

# Check certificate chain
openssl verify -CAfile /etc/letsencrypt/live/yourdomain.com/chain.pem \
  /etc/letsencrypt/live/yourdomain.com/cert.pem

# Test SSL connection
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

#### For Self-Signed
```bash
# Check certificate validity
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Check key format
openssl rsa -in nginx/ssl/key.pem -check

# Verify cert/key match
openssl x509 -noout -modulus -in nginx/ssl/cert.pem | openssl md5
openssl rsa -noout -modulus -in nginx/ssl/key.pem | openssl md5
```

### Common Issues

#### Port 80 Already in Use
```bash
# Find process using port 80
lsof -i :80
# or
netstat -tulpn | grep :80

# Stop the process or use certbot webroot mode instead
```

#### Let's Encrypt Rate Limits
- Production: 50 certificates per domain per week
- Use staging for testing: `--staging` flag
- Check rate limit status: https://crt.sh/?q=yourdomain.com

### Nginx Not Reloading
```bash
# Test configuration
docker exec portfolio-website-nginx-1 nginx -t

# Check logs
docker logs portfolio-website-nginx-1

# Manual reload
docker restart portfolio-website-nginx-1
```

### Rollback to Previous Certificate

#### For Self-Signed Certificates
```bash
# List available backups
ls -la nginx/ssl/backup/

# Manual rollback
cp nginx/ssl/backup/cert_[timestamp].pem nginx/ssl/cert.pem
cp nginx/ssl/backup/key_[timestamp].pem nginx/ssl/key.pem
chmod 644 nginx/ssl/cert.pem
chmod 600 nginx/ssl/key.pem

# Reload nginx
docker exec portfolio-website-nginx-1 nginx -s reload
```

#### For Let's Encrypt
```bash
# Let's Encrypt keeps previous versions
ls -la /etc/letsencrypt/archive/yourdomain.com/

# Revert to previous version (if needed)
# Update symlinks in /etc/letsencrypt/live/yourdomain.com/
# to point to previous cert/key files in archive/
```

## Security Best Practices

1. **Key Security**:
   - Keep private keys secure (mode 600)
   - Never commit keys to version control
   - Use environment variables for sensitive data
   - Store Let's Encrypt certificates in `/etc/letsencrypt/`

2. **Certificate Validation**:
   - Always validate before deployment
   - Test in staging environment first
   - Monitor expiry dates
   - Verify certificate chain completeness

3. **Backup Strategy**:
   - Automatic backups before rotation (kept in `nginx/ssl/backup/`)
   - Keep last 5 backups automatically
   - Off-site backup for production certificates
   - Test restoration process regularly

4. **Production Recommendations**:
   - ✅ Use Let's Encrypt for real domains
   - ✅ Implement HSTS headers (configured)
   - ✅ Use TLSv1.2 and TLSv1.3 only (configured)
   - ✅ Strong cipher suites (ECDHE-RSA-AES128-GCM-SHA256, ECDHE-RSA-AES256-GCM-SHA384)
   - ✅ Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
   - ✅ Rate limiting configured
   - Consider OCSP stapling for improved performance

## Integration with CI/CD

### GitHub Actions Example
```yaml
name: Rotate SSL Certificate

on:
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday at 2 AM
  workflow_dispatch:

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Rotate Certificate
        run: |
          ./scripts/rotate-ssl.sh --check
          if [ $? -eq 0 ]; then
            ./scripts/rotate-ssl.sh --force
          fi
```

### Docker Compose Integration

#### Current Production Setup
The `docker-compose.prod.yml` includes:
```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro  # Let's Encrypt certs
      - ./nginx/ssl:/etc/nginx/ssl:ro         # Self-signed certs (fallback)
```

#### Optional Certbot Container
For containerized certificate management:
```yaml
services:
  certbot:
    image: certbot/certbot
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt
      - /var/lib/letsencrypt:/var/lib/letsencrypt
    command: renew --quiet
```

## Monitoring

### Set up alerts for:
- Certificate expiry < 14 days
- Rotation failures
- Backup failures
- Invalid certificate detection

### Example monitoring script:
```bash
#!/bin/bash
# Add to cron for daily monitoring

DAYS_WARNING=14
cert_expiry=$(./scripts/rotate-ssl.sh --check | grep "expires in" | awk '{print $4}')

if [ "$cert_expiry" -lt "$DAYS_WARNING" ]; then
    # Send alert (email, Slack, etc.)
    echo "WARNING: Certificate expires in $cert_expiry days"
fi
```