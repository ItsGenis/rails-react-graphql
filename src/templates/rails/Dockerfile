# Multi-stage Dockerfile for <%= appName %> Rails Application
# Supports both development and production environments

# =============================================================================
# BASE IMAGE
# =============================================================================
FROM ruby:3.3.5-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
  build-base \
  postgresql-dev \
  postgresql-client \
  tzdata \
  nodejs \
  npm \
  git \
  bash \
  curl \
  && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Set environment variables
ENV RAILS_ENV=production
ENV NODE_ENV=production
ENV RAILS_SERVE_STATIC_FILES=true
ENV RAILS_LOG_TO_STDOUT=true

# =============================================================================
# DEVELOPMENT STAGE
# =============================================================================
FROM base AS development

# Set development environment
ENV RAILS_ENV=development
ENV NODE_ENV=development

# Install development dependencies
RUN apk add --no-cache \
  postgresql-dev \
  && rm -rf /var/cache/apk/*

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install gems
RUN bundle config set --local without 'production' && \
  bundle install --jobs 4 --retry 3

# Copy package.json and install Node.js dependencies (if any)
COPY package*.json ./
RUN npm install --only=dev || true

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p tmp/pids tmp/sockets log

# Set proper permissions
RUN chmod +x bin/* && \
  chown -R nobody:nobody /app

# Switch to non-root user
USER nobody

# Expose port
EXPOSE 3000

# Default command for development
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]

# =============================================================================
# PRODUCTION STAGE
# =============================================================================
FROM base AS production

# Install production dependencies only
RUN apk add --no-cache \
  postgresql-dev \
  && rm -rf /var/cache/apk/*

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install gems (production only)
RUN bundle config set --local without 'development test' && \
  bundle install --jobs 4 --retry 3

# Copy package.json and install Node.js dependencies (if any)
COPY package*.json ./
RUN npm ci --only=production || true

# Copy application code
COPY . .

# Precompile assets (if using asset pipeline)
RUN if [ -f bin/rails ]; then \
  bin/rails assets:precompile; \
  fi

# Create necessary directories
RUN mkdir -p tmp/pids tmp/sockets log

# Set proper permissions
RUN chmod +x bin/* && \
  chown -R nobody:nobody /app

# Switch to non-root user
USER nobody

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Default command for production
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]

# =============================================================================
# TEST STAGE
# =============================================================================
FROM development AS test

# Set test environment
ENV RAILS_ENV=test
ENV NODE_ENV=test

# Install test dependencies
RUN bundle config set --local with 'test' && \
  bundle install

# Copy test configuration
COPY . .

# Default command for tests
CMD ["bundle", "exec", "rails", "test"]
