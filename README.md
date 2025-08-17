# Portfolio Website

A modern, containerized portfolio website built with Next.js, featuring Reveal.js presentations and data visualizations.

## 🚀 Features

### Core Features
- **Modern Tech Stack**: Next.js 14, TypeScript, Tailwind CSS
- **Presentations**: Integrated Reveal.js for interactive presentations
- **Data Visualization**: Charts and analytics with Chart.js
- **Container Ready**: Docker and Kubernetes configurations included
- **Responsive Design**: Mobile-first approach with dark mode support

### DevOps & Security
- **CI/CD Pipeline**: 11 GitHub Actions workflows for complete automation
- **Security Scanning**: Comprehensive vulnerability detection (CodeQL, Trivy, Semgrep, Snyk)
- **Container Security**: Multi-stage builds, non-root user, security contexts
- **SSL/TLS Management**: Let's Encrypt integration with auto-renewal
- **Dependency Management**: Automated updates via Dependabot
- **Code Quality**: ESLint, TypeScript strict mode, automated testing

## 🏃 Quick Start

```bash
# Clone the repository
git clone https://github.com/gguarin-fll/portfolio-website.git
cd portfolio-website

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
├── .github/workflows/     # CI/CD pipelines (11 workflows)
├── app/                   # Next.js app directory
│   ├── api/              # API routes
│   ├── analytics/        # Analytics page
│   ├── presentations/    # Presentations page
│   └── projects/         # Projects page
├── components/           # React components
├── data/                 # Portfolio data
├── k8s/                  # Kubernetes manifests
├── nginx/                # Nginx configuration
├── public/               # Static assets
│   └── presentations/    # Reveal.js presentations
├── scripts/              # Utility scripts (SSL, deployment)
└── types/                # TypeScript types
```

## 🛠️ Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Docker (optional for containerized development)

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Create `.env.local` for development:

```env
# Redis Configuration (REQUIRED in production)
REDIS_PASSWORD=your_secure_redis_password_here

# Application Configuration (optional)
NEXT_PUBLIC_API_URL=https://api.yourportfolio.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NODE_ENV=production
```

**Important**: `REDIS_PASSWORD` is required in production. The application will fail to start without it.

## 📊 Content Management

### Adding Projects
Edit `data/portfolio-data.ts`:
```typescript
{
  id: 'unique-id',
  title: 'Project Name',
  description: 'Short description',
  technologies: ['React', 'Node.js'],
  // ...
}
```

### Adding Presentations
1. Add markdown file to `public/presentations/`
2. Update `data/portfolio-data.ts` with presentation metadata

Presentations use Reveal.js markdown format:
```markdown
# Slide 1
Content

---

# Slide 2
Content

--

## Vertical Slide
```

### Adding Analytics
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

- **Tailwind Config**: `tailwind.config.ts`
- **Global Styles**: `app/globals.css`
- **Component Styles**: Use Tailwind classes inline

## 🐳 Docker Deployment

### Development Environment
```bash
# Build and run with docker compose
docker compose build
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down
```

### Production Environment
```bash
# Set required environment variables
export REDIS_PASSWORD=your_secure_password

# Build production image
docker compose -f docker-compose.prod.yml build

# Run production stack (includes Nginx, Redis, Next.js)
docker compose -f docker-compose.prod.yml up -d
```

The production stack includes:
- Next.js application (port 3000)
- Redis cache with password authentication
- Nginx with SSL/TLS termination (ports 80, 443)

## ☸️ Kubernetes Deployment

### Deploy to Cluster
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy frontend application
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

# Auto-scaling via HPA
kubectl get hpa -n portfolio
```

### Monitoring
```bash
# Check pod logs
kubectl logs -f deployment/portfolio-frontend -n portfolio

# Check resource usage
kubectl top pods -n portfolio
```

## 🌐 Production Server Setup

### Initial Server Setup
```bash
# SSH into your server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
apt update && apt install -y docker-compose-plugin

# Clone repository
git clone https://github.com/gguarin-fll/portfolio-website.git
cd portfolio-website
```

### SSL Certificate Configuration

#### Option 1: Let's Encrypt (Recommended for Production)
```bash
# Install Certbot
apt install -y certbot

# Generate certificate
certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --non-interactive \
  --agree-tos \
  --email admin@yourdomain.com

# Setup automatic renewal
./scripts/setup-cron.sh
```

#### Option 2: Self-Signed (Development Only)
```bash
./scripts/rotate-ssl.sh --type self-signed --force
```

### Deploy to Production
```bash
# Set environment variables
export REDIS_PASSWORD=your_secure_password

# Build and deploy
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Verify deployment
docker ps
curl -I https://yourdomain.com
```

### Updating Production
```bash
# Pull latest changes
git pull

# Rebuild and restart (zero downtime)
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

#### Core Workflows
- **CI/CD Pipeline** (`ci-cd.yml`): Tests, builds, and deploys on push
- **Security Scanning** (`security.yml`): Comprehensive vulnerability detection
- **Pull Request Checks** (`pr-checks.yml`): Validates all pull requests
- **Release Management** (`release.yml`): Automated versioning and changelog

#### Maintenance Workflows
- **Dependency Updates** (`dependency-update.yml`): Weekly automated updates
- **Resource Cleanup** (`cleanup.yml`): Removes old artifacts and images
- **Action Pinning** (`pin-actions.yml`): Security hardening for actions

### Required GitHub Secrets
Configure in Settings → Secrets and variables → Actions:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token
- `REDIS_PASSWORD`: Redis password for production
- `KUBECONFIG`: Base64 encoded kubeconfig (optional, for K8s)
- `CODECOV_TOKEN`: Code coverage reporting (optional)
- `SNYK_TOKEN`: Vulnerability scanning (optional)
- `SLACK_WEBHOOK`: Deployment notifications (optional)

## 🔒 Security Features

### Infrastructure Security
- **SSL/TLS**: Let's Encrypt certificates with auto-renewal
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options
- **Rate Limiting**: 10 req/s for API, 30 req/s general
- **TLS Protocols**: TLSv1.2 and TLSv1.3 only
- **Certificate Rotation**: Automated with backup and rollback

### Application Security
- **Container Hardening**: Non-root user, read-only filesystem
- **Kubernetes Security**: Pod security contexts, seccomp profiles
- **Secret Management**: Environment variable validation, no hardcoded secrets
- **XSS Prevention**: Input sanitization, secure DOM manipulation
- **Dependency Scanning**: Multiple automated vulnerability scanners

### CI/CD Security
- **Workflow Permissions**: Least-privilege for all actions
- **SARIF Integration**: Security findings in GitHub Security tab
- **Automated Updates**: Dependabot for safe dependency updates
- **Supply Chain Security**: Optional action pinning to SHA

## 🔧 Monitoring & Health

### Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```

### Docker Logs
```bash
# Development
docker compose logs -f

# Production
docker compose -f docker-compose.prod.yml logs -f portfolio
```

### SSL Certificate Status
```bash
# Check expiry
./scripts/rotate-ssl.sh --check

# View details
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout
```

## 📋 Production Checklist

- [x] Deploy to cloud server (Linode/DigitalOcean/AWS)
- [x] Configure domain DNS records
- [x] Set up Nginx with SSL/TLS termination
- [x] Install Let's Encrypt certificates
- [x] Configure automatic certificate renewal
- [x] Set up security headers and rate limiting
- [x] Configure firewall (ports 22, 80, 443)
- [x] Set REDIS_PASSWORD environment variable
- [ ] Set up monitoring and alerts
- [ ] Configure automated backups
- [ ] Test disaster recovery procedures

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links

- **Repository**: [https://github.com/gguarin-fll/portfolio-website](https://github.com/gguarin-fll/portfolio-website)
- **Documentation**: [SSL-ROTATION.md](SSL-ROTATION.md)
- **Issues**: [https://github.com/gguarin-fll/portfolio-website/issues](https://github.com/gguarin-fll/portfolio-website/issues)