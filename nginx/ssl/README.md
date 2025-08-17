# SSL Certificates Directory

This directory contains SSL certificates for the portfolio website.

## Important Security Notice

**DO NOT** commit actual SSL certificates or private keys to version control!

The `.gitignore` file is configured to exclude:
- `*.pem` files (certificates and keys)
- `*.key` files (private keys)
- `*.crt` files (certificates)
- `/backup/` directory (certificate backups)

## Production Setup

For production, certificates are managed via Let's Encrypt and stored in:
- `/etc/letsencrypt/live/yourdomain.com/`

## Development Setup

For local development, you can generate self-signed certificates using:
```bash
../scripts/rotate-ssl.sh --type self-signed --force
```

## File Structure

```
ssl/
├── README.md          # This file (tracked)
├── cert.pem          # Certificate (ignored)
├── key.pem           # Private key (ignored)
└── backup/           # Backup directory (ignored)
```