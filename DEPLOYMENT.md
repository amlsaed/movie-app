# CI/CD Pipeline Setup Guide
## React Movie App - Complete Deployment Strategy

This guide covers setting up a complete CI/CD pipeline using GitHub Actions, Jenkins, and Vercel for your React movie application.

## 🚀 Overview

Our CI/CD pipeline includes:
- **GitHub Actions**: Automated testing, building, and deployment
- **Jenkins**: Advanced CI/CD workflows and enterprise integrations
- **Vercel**: Fast, global deployment for React applications
- **Docker**: Containerization for consistent environments

---

## 📋 Prerequisites

### Required Accounts & Tools
- [x] GitHub account
- [x] Vercel account
- [x] Jenkins server (self-hosted or cloud)
- [x] Docker (optional)
- [x] Node.js 18+ installed locally

### Required Tokens & Keys
- GitHub Personal Access Token
- Vercel API Token
- Jenkins API Token (if using remote Jenkins)

---

## 🔧 Step 1: GitHub Repository Setup

### 1.1 Initialize Repository
```bash
# If not already done
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/amlsaed/movie-app.git
git push -u origin main
```

### 1.2 Create Development Branch
```bash
git checkout -b develop
git push -u origin develop
```

### 1.3 Setup Branch Protection Rules
1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

---

## 🚀 Step 2: Vercel Deployment Setup

### 2.1 Install Vercel CLI
```bash
npm i -g vercel
```

### 2.2 Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy project
vercel --prod
```

### 2.3 Get Vercel Project Details
```bash
# Get project info
vercel project ls
vercel env ls
```

### 2.4 Configure Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:
   - `NODE_ENV`: `production`
   - `VITE_APP_NAME`: `React Movie App`
   - Any API keys or external service URLs

### 2.5 Get Required IDs for GitHub Actions
```bash
# Get these values for GitHub secrets
vercel project ls  # Get PROJECT_ID
# Go to Vercel → Settings → General for ORG_ID
```

---

## 🔐 Step 3: GitHub Secrets Configuration

### 3.1 Add Repository Secrets
Go to GitHub → Settings → Secrets and variables → Actions

Add these secrets:
```
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_vercel_org_id
PROJECT_ID=your_vercel_project_id
```

### 3.2 Get Vercel Token
1. Go to Vercel → Settings → Tokens
2. Create new token
3. Copy token to GitHub secrets

---

## 🏗️ Step 4: GitHub Actions Setup

The workflow file is already created at `.github/workflows/ci-cd.yml`

### 4.1 Workflow Features
- **Multi-node testing** (Node 18.x, 20.x)
- **Automated linting** with ESLint
- **Security auditing** with npm audit
- **Build artifacts** uploaded for each run
- **Automatic deployment** to Vercel on main branch
- **Branch-specific triggers** (main, develop)

### 4.2 Customize Package.json Scripts
Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## 🏭 Step 5: Jenkins Setup (Optional Advanced CI/CD)

### 5.1 Install Jenkins Plugins
Required plugins:
- NodeJS Plugin
- Docker Pipeline Plugin
- HTML Publisher Plugin
- Slack Notification Plugin (optional)
- GitHub Integration Plugin

### 5.2 Configure Jenkins Tools
1. Go to Manage Jenkins → Global Tool Configuration
2. Add NodeJS installation:
   - Name: `Node 20.x`
   - Version: `20.x`

### 5.3 Create Jenkins Pipeline Job
1. New Item → Pipeline
2. Pipeline script from SCM
3. SCM: Git
4. Repository URL: Your GitHub repo
5. Script Path: `Jenkinsfile`

### 5.4 Setup Webhooks (Optional)
1. GitHub → Settings → Webhooks
2. Add webhook: `https://your-jenkins.com/github-webhook/`
3. Trigger on push and pull requests

---

## 🐳 Step 6: Docker Setup (Optional)

### 6.1 Build Docker Image
```bash
# Build image
docker build -t react-movie-app .

# Run container
docker run -p 80:80 react-movie-app
```

### 6.2 Docker Compose for Development
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
```

---

## 🔄 Step 7: Workflow Usage

### 7.1 Development Workflow
```bash
# 1. Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 3. Create pull request to develop
# 4. After review, merge to develop
# 5. Create PR from develop to main for production release
```

### 7.2 Automatic Deployments
- **Push to `develop`**: Runs tests, triggers Jenkins staging deployment
- **Push to `main`**: Runs full pipeline, deploys to Vercel production
- **Pull requests**: Runs tests and builds, but no deployment

---

## 📊 Step 8: Monitoring & Notifications

### 8.1 Setup Status Checks
- GitHub Actions provides status checks automatically
- Jenkins can be configured to report status back to GitHub

### 8.2 Slack Notifications (Optional)
1. Create Slack app and get webhook URL
2. Add to Jenkins credentials
3. Configure in Jenkinsfile post-build actions

### 8.3 Vercel Deployment Notifications
- Vercel automatically comments on PRs with preview deployments
- Production deployments trigger notifications in Vercel dashboard

---

## 🛡️ Step 9: Security Best Practices

### 9.1 Environment Variables
- Never commit `.env` files
- Use `.env.example` for documentation
- Store secrets in GitHub Secrets and Vercel Environment Variables

### 9.2 Dependency Security
- Regular `npm audit` runs in CI/CD
- Dependabot for automatic dependency updates
- Lock file (`package-lock.json`) committed to repository

### 9.3 Code Quality
- ESLint configuration enforced in CI
- Branch protection rules prevent direct pushes to main
- Required reviews for all changes

---

## 🚀 Step 10: Going Live

### 10.1 Final Checklist
- [ ] All tests passing in CI/CD
- [ ] Environment variables configured
- [ ] Domain configured in Vercel (optional)
- [ ] SSL certificate active
- [ ] Error monitoring setup (Sentry, LogRocket, etc.)

### 10.2 Custom Domain (Optional)
1. Vercel Dashboard → Domains
2. Add custom domain
3. Configure DNS records
4. SSL automatically provisioned

### 10.3 Performance Monitoring
- Vercel Analytics (built-in)
- Google Lighthouse CI integration
- Bundle size monitoring

---

## 📈 Maintenance & Updates

### Regular Tasks
1. **Weekly**: Review and merge Dependabot PRs
2. **Monthly**: Update Node.js versions in CI/CD
3. **Quarterly**: Review and update security policies
4. **As needed**: Scale infrastructure based on usage

### Troubleshooting Common Issues
1. **Build failures**: Check Node.js version compatibility
2. **Deployment failures**: Verify environment variables
3. **Test failures**: Ensure all dependencies installed
4. **Security alerts**: Address npm audit findings

---

## 🎯 Next Steps

1. **Set up monitoring**: Add error tracking (Sentry)
2. **Add testing**: Increase test coverage with Jest/Vitest
3. **Performance**: Add Lighthouse CI for performance monitoring
4. **Analytics**: Integrate analytics (Google Analytics, Vercel Analytics)
5. **SEO**: Add meta tags and sitemap generation

This pipeline provides a robust, scalable foundation for your React movie app deployment! 🚀