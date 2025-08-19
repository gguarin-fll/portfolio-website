# Portfolio Website

A modern, containerized portfolio website built with Next.js, featuring Reveal.js presentations and data visualizations.

## 🚀 Features

### Core Features
- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Redis Caching**: High-performance caching with Redis Cloud integration
- **View Tracking**: Real-time project view counting and analytics
- **Presentations**: Integrated Reveal.js for interactive presentations
- **Data Visualization**: Charts and analytics with Chart.js and Recharts
- **Container Ready**: Docker and Kubernetes configurations included
- **Responsive Design**: Mobile-first approach with dark mode support

### DevOps & Security
- **CI/CD Pipeline**: 12 GitHub Actions workflows for complete automation
- **Redis Security**: ACL-based access control with restricted user permissions
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
├── .github/workflows/     # CI/CD pipelines (12 workflows)
├── app/                   # Next.js app directory
│   ├── api/              # API routes
│   │   ├── cache/        # Cache management endpoints
│   │   ├── health/       # Health check endpoints
│   │   ├── monitor/      # Redis monitoring
│   │   ├── portfolio/    # Cached portfolio data
│   │   └── projects/     # Project views and stats
│   ├── analytics/        # Analytics page
│   ├── presentations/    # Presentations page
│   └── projects/         # Projects page
├── components/           # React components
├── config/               # Configuration files
├── data/                 # Portfolio data
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── redis.ts          # Redis client
│   └── redis-optimized.ts # Optimized Redis client
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
- Redis 7+ (or Redis Cloud account)
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
# Use a restricted user (not default) for security
REDIS_URL=redis://portfolio_app:your_password@your-redis-host:port

# For local development:
# REDIS_URL=redis://localhost:6379

# Application Configuration (optional)
NEXT_PUBLIC_API_URL=https://api.yourportfolio.com
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NODE_ENV=production
```

**Important**: `REDIS_URL` is required in production. Use a restricted Redis user with minimal permissions for security.

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

## 🔴 Redis Configuration

### Redis Cloud Setup
The application uses Redis for caching and view tracking:

1. **Create Redis Cloud Account**: Sign up at [Redis Cloud](https://redis.com/cloud/)
2. **Create Database**: Choose the free 30MB tier for portfolios
3. **Create Restricted User**: 
   - Username: `portfolio_app`
   - Permissions: Read/Write (no admin commands)
   - ACL Rules: Block `FLUSHDB`, `FLUSHALL`, `CONFIG`
4. **Get Connection String**: `redis://portfolio_app:password@host:port`

### Local Redis Development
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Using Homebrew (macOS)
brew install redis
redis-server

# Set local environment variable
export REDIS_URL=redis://localhost:6379
```

### Redis Features
- **Portfolio Data Caching**: 1-hour TTL for static data
- **View Counting**: Persistent tracking for projects
- **API Response Caching**: 5-minute TTL for dynamic data
- **Performance Monitoring**: Cache hit/miss tracking
- **Connection Pooling**: Optimized for serverless functions

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
export REDIS_URL=redis://portfolio_app:your_password@redis-cloud-host:port

# Build production image
docker compose -f docker-compose.prod.yml build

# Run production stack
docker compose -f docker-compose.prod.yml up -d
```

The production stack includes:
- Next.js application (port 3000)
- Redis Cloud connection with ACL security
- Nginx with SSL/TLS termination (ports 80, 443)
- Real-time view tracking and caching

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
export REDIS_URL=redis://portfolio_app:your_password@redis-cloud-host:port

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

#### Required Secrets
- `REDIS_URL`: Full Redis connection string with restricted user
  - Format: `redis://portfolio_app:password@host:port`
  - Example: `redis://portfolio_app:pass123@redis-cloud.com:14652`
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token

#### Optional Secrets
- `KUBECONFIG`: Base64 encoded kubeconfig (for K8s deployments)
- `CODECOV_TOKEN`: Code coverage reporting
- `SNYK_TOKEN`: Vulnerability scanning
- `SLACK_WEBHOOK`: Deployment notifications
- `SERVER_HOST`: Production server IP/hostname
- `SERVER_USER`: SSH username for deployment
- `SSH_PRIVATE_KEY`: SSH key for server access

## 🔒 Security Features

### Infrastructure Security
- **SSL/TLS**: Let's Encrypt certificates with auto-renewal
- **Security Headers**: HSTS, X-Frame-Options, X-Content-Type-Options
- **Rate Limiting**: 10 req/s for API, 30 req/s general
- **TLS Protocols**: TLSv1.2 and TLSv1.3 only
- **Certificate Rotation**: Automated with backup and rollback

### Application Security
- **Redis ACL**: Restricted user with minimal permissions (no FLUSH/CONFIG)
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

### API Endpoints

#### Health Checks
```bash
# Application health
curl http://localhost:3000/api/health

# Redis connectivity check
curl http://localhost:3000/api/health/redis
```

#### Redis Monitoring
```bash
# Detailed Redis metrics and alerts
curl http://localhost:3000/api/monitor/redis

# Project statistics and view counts
curl http://localhost:3000/api/projects/stats

# Get cached portfolio data
curl http://localhost:3000/api/portfolio
```

#### Cache Management
```bash
# Clear all cache entries (admin only)
curl -X POST http://localhost:3000/api/cache/clear

# Track project views
curl -X POST http://localhost:3000/api/projects/{id}/views
curl http://localhost:3000/api/projects/{id}/views
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

### Redis Monitoring Dashboard
The `/api/monitor/redis` endpoint provides:
- Memory usage with alerts (>80% triggers warning)
- Cache hit/miss ratio (target >70%)
- Connection count monitoring (alert >50)
- Real-time performance metrics

## 📋 Production Checklist

- [x] Deploy to cloud server (Linode/DigitalOcean/AWS)
- [x] Configure domain DNS records
- [x] Set up Nginx with SSL/TLS termination
- [x] Install Let's Encrypt certificates
- [x] Configure automatic certificate renewal
- [x] Set up security headers and rate limiting
- [x] Configure firewall (ports 22, 80, 443)
- [x] Set up Redis Cloud with restricted user
- [x] Configure REDIS_URL with ACL permissions
- [x] Implement Redis monitoring endpoints
- [ ] Set up alerting for Redis metrics
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