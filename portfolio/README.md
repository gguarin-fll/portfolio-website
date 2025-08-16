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
portfolio/
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
# Build development image
docker build -t portfolio:dev --target development .

# Run with docker-compose
docker-compose up
```

### Production
```bash
# Build production image
docker build -t portfolio:latest --target production .

# Run production stack
docker-compose -f docker-compose.prod.yml up
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
Create `.env.local`:
```env
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

## 🚀 Production Checklist

- [ ] Update environment variables
- [ ] Configure domain in ingress
- [ ] Set up SSL certificates
- [ ] Configure container registry
- [ ] Update image tags in K8s manifests
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Test rollback procedures

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request