#!/bin/bash

# SSL Certificate Rotation Script
# This script rotates SSL certificates for the portfolio website

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SSL_DIR="$PROJECT_ROOT/nginx/ssl"
BACKUP_DIR="$SSL_DIR/backup"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
CERT_DAYS="${CERT_DAYS:-365}"
CERT_COUNTRY="${CERT_COUNTRY:-US}"
CERT_STATE="${CERT_STATE:-State}"
CERT_CITY="${CERT_CITY:-City}"
CERT_ORG="${CERT_ORG:-Organization}"
CERT_CN="${CERT_CN:-portfolio.local}"
CERT_SAN="${CERT_SAN:-DNS:portfolio.local,DNS:localhost,IP:127.0.0.1}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if certificate needs rotation
check_cert_expiry() {
    if [ ! -f "$SSL_DIR/cert.pem" ]; then
        print_warning "Certificate not found"
        return 1
    fi
    
    # Get certificate expiry date
    expiry_date=$(openssl x509 -in "$SSL_DIR/cert.pem" -noout -enddate | cut -d= -f2)
    expiry_timestamp=$(date -d "$expiry_date" +%s)
    current_timestamp=$(date +%s)
    days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
    
    print_status "Certificate expires in $days_until_expiry days"
    
    # Rotate if less than 30 days until expiry
    if [ $days_until_expiry -lt 30 ]; then
        print_warning "Certificate expiring soon, rotation needed"
        return 0
    else
        print_status "Certificate is still valid"
        return 2
    fi
}

# Function to backup existing certificates
backup_certificates() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
    fi
    
    timestamp=$(date +%Y%m%d_%H%M%S)
    
    if [ -f "$SSL_DIR/cert.pem" ]; then
        cp "$SSL_DIR/cert.pem" "$BACKUP_DIR/cert_${timestamp}.pem"
        print_status "Backed up cert.pem to $BACKUP_DIR/cert_${timestamp}.pem"
    fi
    
    if [ -f "$SSL_DIR/key.pem" ]; then
        cp "$SSL_DIR/key.pem" "$BACKUP_DIR/key_${timestamp}.pem"
        print_status "Backed up key.pem to $BACKUP_DIR/key_${timestamp}.pem"
    fi
}

# Function to generate new self-signed certificate
generate_self_signed() {
    print_status "Generating new self-signed certificate..."
    
    openssl req -x509 -nodes -days "$CERT_DAYS" -newkey rsa:2048 \
        -keyout "$SSL_DIR/key.pem.new" \
        -out "$SSL_DIR/cert.pem.new" \
        -subj "/C=$CERT_COUNTRY/ST=$CERT_STATE/L=$CERT_CITY/O=$CERT_ORG/CN=$CERT_CN" \
        -addext "subjectAltName=$CERT_SAN" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_status "New certificate generated successfully"
        return 0
    else
        print_error "Failed to generate certificate"
        return 1
    fi
}

# Function to generate Let's Encrypt certificate (requires certbot)
generate_letsencrypt() {
    local domain="$1"
    local email="$2"
    
    if ! command -v certbot &> /dev/null; then
        print_error "Certbot not installed. Install with: apt-get install certbot"
        return 1
    fi
    
    print_status "Generating Let's Encrypt certificate for $domain..."
    
    certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email "$email" \
        -d "$domain" \
        --cert-path "$SSL_DIR/cert.pem.new" \
        --key-path "$SSL_DIR/key.pem.new"
    
    if [ $? -eq 0 ]; then
        print_status "Let's Encrypt certificate generated successfully"
        return 0
    else
        print_error "Failed to generate Let's Encrypt certificate"
        return 1
    fi
}

# Function to validate new certificate
validate_certificate() {
    print_status "Validating new certificate..."
    
    # Check if files exist
    if [ ! -f "$SSL_DIR/cert.pem.new" ] || [ ! -f "$SSL_DIR/key.pem.new" ]; then
        print_error "New certificate files not found"
        return 1
    fi
    
    # Verify certificate format
    openssl x509 -in "$SSL_DIR/cert.pem.new" -text -noout > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        print_error "Invalid certificate format"
        return 1
    fi
    
    # Verify private key format
    openssl rsa -in "$SSL_DIR/key.pem.new" -check > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        print_error "Invalid private key format"
        return 1
    fi
    
    # Verify certificate and key match
    cert_modulus=$(openssl x509 -noout -modulus -in "$SSL_DIR/cert.pem.new" | openssl md5)
    key_modulus=$(openssl rsa -noout -modulus -in "$SSL_DIR/key.pem.new" | openssl md5)
    
    if [ "$cert_modulus" != "$key_modulus" ]; then
        print_error "Certificate and private key do not match"
        return 1
    fi
    
    print_status "Certificate validation successful"
    return 0
}

# Function to deploy new certificate
deploy_certificate() {
    print_status "Deploying new certificate..."
    
    # Move new certificates to active location
    mv "$SSL_DIR/cert.pem.new" "$SSL_DIR/cert.pem"
    mv "$SSL_DIR/key.pem.new" "$SSL_DIR/key.pem"
    
    # Set proper permissions
    chmod 644 "$SSL_DIR/cert.pem"
    chmod 600 "$SSL_DIR/key.pem"
    
    print_status "Certificate deployed successfully"
}

# Function to reload nginx
reload_nginx() {
    print_status "Reloading Nginx configuration..."
    
    # Check if nginx is running in Docker
    if docker ps | grep -q nginx; then
        container_name=$(docker ps --format "table {{.Names}}" | grep nginx | head -1)
        docker exec "$container_name" nginx -t 2>/dev/null
        if [ $? -eq 0 ]; then
            docker exec "$container_name" nginx -s reload
            print_status "Nginx reloaded successfully"
        else
            print_error "Nginx configuration test failed"
            return 1
        fi
    else
        print_warning "Nginx container not running"
    fi
}

# Function to rollback certificates
rollback_certificate() {
    print_error "Rolling back to previous certificate..."
    
    # Find the most recent backup
    latest_cert=$(ls -t "$BACKUP_DIR"/cert_*.pem 2>/dev/null | head -1)
    latest_key=$(ls -t "$BACKUP_DIR"/key_*.pem 2>/dev/null | head -1)
    
    if [ -z "$latest_cert" ] || [ -z "$latest_key" ]; then
        print_error "No backup certificates found"
        return 1
    fi
    
    cp "$latest_cert" "$SSL_DIR/cert.pem"
    cp "$latest_key" "$SSL_DIR/key.pem"
    
    chmod 644 "$SSL_DIR/cert.pem"
    chmod 600 "$SSL_DIR/key.pem"
    
    print_status "Rolled back to previous certificate"
    reload_nginx
}

# Function to clean old backups (keep last 5)
clean_old_backups() {
    print_status "Cleaning old backups..."
    
    if [ -d "$BACKUP_DIR" ]; then
        # Keep only the 5 most recent backups of each type
        ls -t "$BACKUP_DIR"/cert_*.pem 2>/dev/null | tail -n +6 | xargs -r rm
        ls -t "$BACKUP_DIR"/key_*.pem 2>/dev/null | tail -n +6 | xargs -r rm
        print_status "Old backups cleaned"
    fi
}

# Main rotation function
rotate_certificate() {
    local cert_type="${1:-self-signed}"
    local domain="$2"
    local email="$3"
    
    print_status "Starting certificate rotation process..."
    
    # Backup existing certificates
    backup_certificates
    
    # Generate new certificate based on type
    case "$cert_type" in
        self-signed)
            generate_self_signed
            ;;
        letsencrypt)
            if [ -z "$domain" ] || [ -z "$email" ]; then
                print_error "Domain and email required for Let's Encrypt"
                return 1
            fi
            generate_letsencrypt "$domain" "$email"
            ;;
        *)
            print_error "Unknown certificate type: $cert_type"
            return 1
            ;;
    esac
    
    # Validate new certificate
    if validate_certificate; then
        # Deploy new certificate
        deploy_certificate
        
        # Reload nginx
        if reload_nginx; then
            print_status "Certificate rotation completed successfully"
            clean_old_backups
            return 0
        else
            print_error "Failed to reload Nginx"
            rollback_certificate
            return 1
        fi
    else
        print_error "Certificate validation failed"
        rm -f "$SSL_DIR/cert.pem.new" "$SSL_DIR/key.pem.new"
        return 1
    fi
}

# Parse command line arguments
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -t, --type TYPE        Certificate type (self-signed or letsencrypt)"
    echo "  -d, --domain DOMAIN    Domain name (required for letsencrypt)"
    echo "  -e, --email EMAIL      Email address (required for letsencrypt)"
    echo "  -f, --force            Force rotation even if certificate is still valid"
    echo "  -c, --check            Check certificate expiry only"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --check                                    # Check if rotation is needed"
    echo "  $0 --type self-signed --force                 # Force rotate with self-signed"
    echo "  $0 --type letsencrypt -d example.com -e admin@example.com"
    echo ""
}

# Main script execution
main() {
    local cert_type="self-signed"
    local domain=""
    local email=""
    local force=false
    local check_only=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -t|--type)
                cert_type="$2"
                shift 2
                ;;
            -d|--domain)
                domain="$2"
                shift 2
                ;;
            -e|--email)
                email="$2"
                shift 2
                ;;
            -f|--force)
                force=true
                shift
                ;;
            -c|--check)
                check_only=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Check only mode
    if [ "$check_only" = true ]; then
        check_cert_expiry
        exit $?
    fi
    
    # Check if rotation is needed (unless forced)
    if [ "$force" = false ]; then
        check_cert_expiry
        result=$?
        if [ $result -eq 2 ]; then
            print_status "No rotation needed. Use --force to rotate anyway."
            exit 0
        fi
    fi
    
    # Perform rotation
    rotate_certificate "$cert_type" "$domain" "$email"
}

# Run main function
main "$@"