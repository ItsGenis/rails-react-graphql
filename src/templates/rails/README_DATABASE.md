# Database Setup Guide

This guide will help you set up PostgreSQL for your <%= appName %> Rails application.

## Prerequisites

1. **Install PostgreSQL**
   - **macOS**: `brew install postgresql`
   - **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
   - **Windows**: Download from [PostgreSQL website](https://www.postgresql.org/download/windows/)

2. **Start PostgreSQL Service**
   - **macOS**: `brew services start postgresql`
   - **Ubuntu/Debian**: `sudo systemctl start postgresql`
   - **Windows**: PostgreSQL service should start automatically

## Quick Setup

1. **Run the database setup script**:
   ```bash
   cd backend
   chmod +x bin/setup-database
   ./bin/setup-database
   ```

2. **Edit the environment file**:
   ```bash
   cp config/env.example .env
   # Edit .env with your database credentials
   ```

3. **Install gems and setup database**:
   ```bash
   bundle install
   rails db:create
   rails db:migrate
   ```

## Manual Setup

If you prefer to set up manually:

1. **Create a PostgreSQL user** (optional):
   ```bash
   sudo -u postgres createuser --interactive
   # Enter your username when prompted
   ```

2. **Create the databases**:
   ```bash
   sudo -u postgres createdb <%= appName %>_development
   sudo -u postgres createdb <%= appName %>_test
   ```

3. **Configure environment variables**:
   Create a `.env` file in the backend directory:
   ```bash
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_USERNAME` | Database username | `postgres` |
| `DATABASE_PASSWORD` | Database password | (empty) |

## Troubleshooting

### Connection Refused
- Make sure PostgreSQL is running
- Check if the port is correct (default: 5432)
- Verify firewall settings

### Authentication Failed
- Check username and password in `.env` file
- Ensure the user has proper permissions
- Try connecting with `psql` to test credentials

### Database Does Not Exist
- Run `rails db:create` to create databases
- Check if the user has CREATE DATABASE privileges

## Development Workflow

1. **Start the Rails server**:
   ```bash
   rails server
   ```

2. **Access the application**:
   - Rails API: http://localhost:3000
   - GraphQL Playground: http://localhost:3000/graphiql

3. **Run tests**:
   ```bash
   rails test
   # or with RSpec
   bundle exec rspec
   ```

## Production Setup

For production environments:

1. **Set environment variables**:
   ```bash
   DATABASE_URL=postgresql://username:password@host:port/database
   DATABASE_HOST=your_production_host
   DATABASE_PORT=5432
   DATABASE_USERNAME=your_production_username
   DATABASE_PASSWORD=your_production_password
   ```

2. **Run migrations**:
   ```bash
   RAILS_ENV=production rails db:migrate
   ```

3. **Seed data** (if needed):
   ```bash
   RAILS_ENV=production rails db:seed
   ```
