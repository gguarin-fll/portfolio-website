# Portfolio Website

A modern, containerized portfolio website built with Next.js, featuring Reveal.js presentations and data visualizations.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Presentations**: Integrated Reveal.js for interactive presentations
- **Data Visualization**: Charts and analytics with Chart.js
- **Container Ready**: Docker and Kubernetes configurations included
- **CI/CD Pipeline**: GitHub Actions workflow for automated deployment
- **Responsive Design**: Mobile-first approach with dark mode support

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── analytics/         # Analytics page
│   ├── presentations/     # Presentations page
│   └── projects/          # Projects page
├── components/            # React components
├── data/                  # Portfolio data
├── k8s/                   # Kubernetes manifests
├── public/                # Static assets
│   └── presentations/     # Reveal.js presentations
└── types/                 # TypeScript types
```

## 🛠️ Local Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (optional)
- Kubernetes cluster (optional)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🐳 Docker Deployment

### Development
```bash
# Build and run with docker compose
docker compose build
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down
```

### Production
```bash
# Build production image
docker compose -f docker-compose.prod.yml build

# Run production stack with SSL
docker compose -f docker-compose.prod.yml up -d

# The production stack includes:
# - Next.js application (port 3000)
# - Redis cache
# - Nginx with SSL/TLS (ports 80, 443)
```

## ☸️ Kubernetes Deployment

### Deploy to Kubernetes
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy frontend
kubectl apply -f k8s/frontend/

# Configure ingress
kubectl apply -f k8s/ingress/

# Check deployment status
kubectl get pods -n portfolio
kubectl get services -n portfolio
```

### Scaling
```bash
# Manual scaling
kubectl scale deployment portfolio-frontend --replicas=5 -n portfolio

# Auto-scaling is configured via HPA
kubectl get hpa -n portfolio
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow automatically:
1. Runs tests and linting
2. Builds Docker images
3. Pushes to container registry
4. Deploys to Kubernetes cluster

### Required Secrets
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password
- `KUBECONFIG`: Base64 encoded kubeconfig

## 📊 Adding Content

### Projects
Edit `data/portfolio-data.ts` to add new projects:
```typescript
{
  id: 'unique-id',
  title: 'Project Name',
  description: 'Short description',
  technologies: ['React', 'Node.js'],
  // ...
}
```

### Presentations
1. Add markdown file to `public/presentations/`
2. Update `data/portfolio-data.ts` with presentation metadata

### Analytics
Configure charts in `data/portfolio-data.ts`:
```typescript
{
  id: 'chart-id',
  title: 'Chart Title',
  chartType: 'bar',
  data: { /* chart data */ }
}
```

## 🎨 Customization

### Styling
- Tailwind config: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Component styles: Use Tailwind classes

### Environment Variables
Create `.env` for production:
```env
# Redis Configuration
REDIS_PASSWORD=your_secure_redis_password_here

# Application Configuration (optional)
NEXT_PUBLIC_API_URL=https://api.yourportfolio.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 📝 Presentation Format

Presentations use Reveal.js markdown format:
```markdown
# Slide 1
Content

---

# Slide 2
Content

---

## Vertical Slide
Use `--` for vertical slides
```

## 🔧 Monitoring

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Kubernetes Monitoring
```bash
# Check pod logs
kubectl logs -f deployment/portfolio-frontend -n portfolio

# Check resource usage
kubectl top pods -n portfolio
```

## 🌐 Production Deployment with SSL

### Initial Setup
```bash
# SSH into your server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Certbot for SSL certificates
apt update && apt install -y certbot

# Clone repository
git clone git@github.com:gguarin-fll/portfolio-website.git
cd portfolio-website
```

### SSL Certificate Setup

#### Option 1: Let's Encrypt (Production)
```bash
# Generate Let's Encrypt certificate for your domain
certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --non-interactive \
  --agree-tos \
  --email admin@yourdomain.com

# Certificates will be stored in /etc/letsencrypt/live/yourdomain.com/
```

#### Option 2: Self-Signed (Development/Testing)
```bash
# Use the included script to generate self-signed certificates
./scripts/rotate-ssl.sh --type self-signed --force
```

### Deploy Production Stack
```bash
# Build production image
docker compose -f docker-compose.prod.yml build

# Run production stack with Nginx SSL
docker compose -f docker-compose.prod.yml up -d

# Verify deployment
docker ps
curl -I https://yourdomain.com
```

### SSL Certificate Management

#### Check Certificate Status
```bash
# Check certificate expiry
./scripts/rotate-ssl.sh --check

# View certificate details
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout
```

#### Automatic Renewal Setup
```bash
# Setup automated certificate renewal
./scripts/setup-cron.sh

# Or manually add cron job for Let's Encrypt
(crontab -l 2>/dev/null; echo "0 3 * * * /root/portfolio-website/scripts/renew-letsencrypt.sh") | crontab -
```

#### Manual Certificate Rotation
```bash
# Force rotate certificate
./scripts/rotate-ssl.sh --force

# Rotate with Let's Encrypt
./scripts/rotate-ssl.sh --type letsencrypt \
  --domain yourdomain.com \
  --email admin@yourdomain.com
```

### Nginx Configuration
The production Nginx configuration (`nginx/nginx.conf`) includes:
- HTTP to HTTPS redirect
- SSL/TLS with modern cipher suites
- Security headers (HSTS, X-Frame-Options, etc.)
- Rate limiting
- Gzip compression
- Reverse proxy to Next.js application

### Updating the Application
```bash
# Pull latest changes
git pull

# Rebuild and restart with zero downtime
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

## 🚀 Production Checklist

- [x] Deploy to cloud server (Linode/DigitalOcean/AWS)
- [x] Configure domain DNS
- [x] Set up Nginx with SSL/TLS termination
- [x] Install Let's Encrypt certificates
- [x] Configure automatic certificate renewal
- [x] Set up security headers (HSTS, CSP, etc.)
- [x] Configure firewall (ports 22, 80, 443)
- [x] Implement rate limiting
- [ ] Set up monitoring and alerts
- [ ] Configure automated backups
- [ ] Test rollback procedures

## 🔒 Security Features

- **SSL/TLS**: Let's Encrypt certificates with auto-renewal
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Rate Limiting**: Protection against brute force attacks
- **TLS Protocols**: TLSv1.2 and TLSv1.3 only
- **Certificate Backup**: Automatic backup before rotation
- **Zero-Downtime Updates**: Graceful reloads during certificate rotation

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 🔗 Repository

[https://github.com/gguarin-fll/portfolio-website](https://github.com/gguarin-fll/portfolio-website)