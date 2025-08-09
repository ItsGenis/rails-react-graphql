# Environment Variables and Secrets Management

This guide covers environment variable configuration and secrets management for your <%= appName %> Rails application.

## Overview

The application uses a multi-layered approach to configuration management:

1. **Environment Variables** - For runtime configuration
2. **Rails Credentials** - For sensitive data encryption
3. **Configuration Files** - For application settings
4. **Dotenv** - For local development

## Quick Setup

### 1. Run the Setup Script
```bash
chmod +x bin/setup-environment
./bin/setup-environment
```

### 2. Edit Environment File
```bash
# Edit the generated .env file
nano .env
```

### 3. Set Required Variables
```bash
# Required variables
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
JWT_SECRET_KEY=your_jwt_secret

# Optional variables
APP_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Configuration Files

### Application Configuration (`config/application.yml`)
Contains all application settings with environment variable support:

```yaml
defaults: &defaults
  app_name: <%= appName %>
  app_url: <%= ENV['APP_URL'] || 'http://localhost:3000' %>
  database_host: <%= ENV['DATABASE_HOST'] || 'localhost' %>
  # ... more settings

development:
  <<: *defaults
  rails_log_level: debug

production:
  <<: *defaults
  rails_log_level: info
  force_ssl: true
```

### Environment Variables (`.env`)
Local development environment variables:

```bash
# Application
APP_URL=http://localhost:3000
RAILS_ENV=development
RAILS_MAX_THREADS=5

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password

# JWT Authentication
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRATION_HOURS=24

# GraphQL
GRAPHQL_MAX_COMPLEXITY=1000
GRAPHQL_MAX_DEPTH=20

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_USERNAME` | PostgreSQL username | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL password | `your_password` |
| `JWT_SECRET_KEY` | JWT signing secret | `generated_secret` |

### Application Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_URL` | Application URL | `http://localhost:3000` |
| `APP_HOST` | Application host | `localhost` |
| `APP_PORT` | Application port | `3000` |
| `RAILS_ENV` | Rails environment | `development` |
| `RAILS_MAX_THREADS` | Max threads | `5` |
| `RAILS_LOG_LEVEL` | Log level | `debug` |

### Database Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | Database host | `localhost` |
| `DATABASE_PORT` | Database port | `5432` |
| `DATABASE_NAME` | Database name | `<%= appName %>_#{Rails.env}` |
| `DATABASE_URL` | Full database URL | Auto-generated |

### JWT Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET_KEY` | JWT signing secret | Rails credentials |
| `JWT_EXPIRATION_HOURS` | Token expiration | `24` |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |

### GraphQL Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GRAPHQL_MAX_COMPLEXITY` | Max query complexity | `1000` |
| `GRAPHQL_MAX_DEPTH` | Max query depth | `20` |

### CORS Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CORS_ORIGINS` | Allowed origins | `http://localhost:3000,http://localhost:5173` |
| `CORS_METHODS` | Allowed methods | `GET,POST,PUT,DELETE,OPTIONS` |
| `CORS_HEADERS` | Allowed headers | `Content-Type,Authorization` |

### External Services

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `SIDEKIQ_URL` | Sidekiq Redis URL | `redis://localhost:6379/1` |
| `API_KEY` | External API key | Rails credentials |
| `AWS_ACCESS_KEY_ID` | AWS access key | Rails credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Rails credentials |
| `STRIPE_SECRET_KEY` | Stripe secret key | Rails credentials |

## Rails Credentials

### Managing Credentials

```bash
# Edit credentials for current environment
rails credentials:edit

# Edit credentials for specific environment
rails credentials:edit --environment=production

# Show credentials (read-only)
rails credentials:show

# Add new credentials
rails credentials:edit
# Add to the YAML:
# jwt_secret_key: your_secret_key
# api_key: your_api_key
```

### Credentials Structure

```yaml
# config/credentials/development.yml.enc
jwt_secret_key: your_jwt_secret
api_key: your_api_key
external_service_token: your_token
mailer_password: your_password
aws_access_key_id: your_aws_key
aws_secret_access_key: your_aws_secret
stripe_secret_key: your_stripe_key
```

## Accessing Configuration

### In Ruby Code

```ruby
# Using AppConfig module
AppConfig.app_name
AppConfig.database_host
AppConfig.graphql_max_complexity

# Using Secrets module
Secrets.jwt_secret_key
Secrets.database_url
Secrets.api_key

# Using Rails credentials
Rails.application.credentials.jwt_secret_key
Rails.application.credentials.api_key
```

### In Views

```erb
<%= AppConfig.app_name %>
<%= AppConfig.app_url %>
```

### In JavaScript

```javascript
// Available via meta tags
const appName = document.querySelector('meta[name="app-name"]').content;
const apiUrl = document.querySelector('meta[name="api-url"]').content;
```

## Security Best Practices

### 1. Never Commit Sensitive Data
```bash
# .gitignore should include:
.env
.env.*
config/credentials/*.key
config/credentials/*.yml.enc
```

### 2. Use Environment Variables in Production
```bash
# Set environment variables
export DATABASE_PASSWORD=your_secure_password
export JWT_SECRET_KEY=your_secure_jwt_secret

# Or use a .env file (not committed to git)
echo "DATABASE_PASSWORD=your_secure_password" >> .env
```

### 3. Rotate Secrets Regularly
```bash
# Generate new JWT secret
openssl rand -hex 64

# Update credentials
rails credentials:edit
```

### 4. Validate Configuration
```bash
# Run validation script
./bin/setup-environment

# Check required variables
rails runner "puts 'JWT Secret: ' + (Secrets.jwt_secret_key.present? ? 'OK' : 'MISSING')"
```

## Environment-Specific Configuration

### Development
```bash
# .env file
RAILS_ENV=development
RAILS_LOG_LEVEL=debug
FORCE_SSL=false
SECURE_COOKIES=false
```

### Test
```bash
# config/application.yml
test:
  database_name: <%= appName %>_test
  rails_log_level: warn
  force_ssl: false
```

### Production
```bash
# Environment variables
RAILS_ENV=production
RAILS_LOG_LEVEL=info
FORCE_SSL=true
SECURE_COOKIES=true
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET_KEY=secure_jwt_secret
```

## Troubleshooting

### Common Issues

#### 1. Missing Environment Variables
```bash
# Error: Missing required environment variables
# Solution: Set required variables in .env file
echo "DATABASE_USERNAME=postgres" >> .env
echo "DATABASE_PASSWORD=your_password" >> .env
```

#### 2. Credentials Not Found
```bash
# Error: Missing credentials file
# Solution: Generate credentials
rails credentials:edit
```

#### 3. Database Connection Failed
```bash
# Error: Database connection failed
# Solution: Check database configuration
./bin/setup-database
```

#### 4. JWT Secret Not Configured
```bash
# Error: JWT secret not configured
# Solution: Generate JWT secret
openssl rand -hex 64
# Add to .env: JWT_SECRET_KEY=generated_secret
```

### Validation Commands

```bash
# Validate environment setup
./bin/setup-environment

# Check configuration
rails runner "puts AppConfig.all"

# Test database connection
rails runner "ActiveRecord::Base.connection.execute('SELECT 1')"

# Validate secrets
rails runner "puts Secrets.jwt_secret_key.present? ? 'OK' : 'MISSING'"
```

## Deployment

### Heroku
```bash
# Set environment variables
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET_KEY=your_secret
heroku config:set RAILS_ENV=production

# Set credentials
heroku config:set RAILS_MASTER_KEY=your_master_key
```

### Docker
```dockerfile
# Dockerfile
ENV RAILS_ENV=production
ENV DATABASE_URL=postgresql://...
ENV JWT_SECRET_KEY=your_secret

# docker-compose.yml
environment:
  - DATABASE_URL=postgresql://...
  - JWT_SECRET_KEY=your_secret
```

### Kubernetes
```yaml
# ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  RAILS_ENV: "production"
  APP_URL: "https://api.example.com"

# Secret
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  JWT_SECRET_KEY: <base64-encoded-secret>
  DATABASE_PASSWORD: <base64-encoded-password>
```

## Resources

- [Rails Credentials Guide](https://guides.rubyonrails.org/security.html#custom-credentials)
- [Environment Variables Best Practices](https://12factor.net/config)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Dotenv Gem Documentation](https://github.com/bkeepers/dotenv)
