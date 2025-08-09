# Secrets Management Initializer
# Handles sensitive configuration and credentials management

# Load environment variables from .env file if it exists
if File.exist?(Rails.root.join('.env'))
  require 'dotenv'
  Dotenv.load(Rails.root.join('.env'))
end

# Configure Rails credentials
Rails.application.configure do
  # Set up credentials for different environments
  config.require_master_key = true if Rails.env.production?

  # Configure credentials path
  config.credentials.content_path = Rails.root.join('config', 'credentials', "#{Rails.env}.yml.enc")
  config.credentials.key_path = Rails.root.join('config', 'credentials', "#{Rails.env}.key")
end

# Create Secrets module for accessing sensitive data
module Secrets
  class << self
    def jwt_secret_key
      ENV['JWT_SECRET_KEY'] || Rails.application.credentials.jwt_secret_key || Rails.application.credentials.secret_key_base
    end

    def database_url
      ENV['DATABASE_URL'] || build_database_url
    end

    def redis_url
      ENV['REDIS_URL'] || 'redis://localhost:6379/0'
    end

    def api_key
      ENV['API_KEY'] || Rails.application.credentials.api_key
    end

    def external_service_token
      ENV['EXTERNAL_SERVICE_TOKEN'] || Rails.application.credentials.external_service_token
    end

    def mailer_password
      ENV['MAILER_PASSWORD'] || Rails.application.credentials.mailer_password
    end

    def aws_access_key_id
      ENV['AWS_ACCESS_KEY_ID'] || Rails.application.credentials.aws_access_key_id
    end

    def aws_secret_access_key
      ENV['AWS_SECRET_ACCESS_KEY'] || Rails.application.credentials.aws_secret_access_key
    end

    def aws_region
      ENV['AWS_REGION'] || Rails.application.credentials.aws_region || 'us-east-1'
    end

    def stripe_secret_key
      ENV['STRIPE_SECRET_KEY'] || Rails.application.credentials.stripe_secret_key
    end

    def stripe_publishable_key
      ENV['STRIPE_PUBLISHABLE_KEY'] || Rails.application.credentials.stripe_publishable_key
    end

    private

    def build_database_url
      host = ENV['DATABASE_HOST'] || 'localhost'
      port = ENV['DATABASE_PORT'] || '5432'
      username = ENV['DATABASE_USERNAME'] || 'postgres'
      password = ENV['DATABASE_PASSWORD'] || ''
      database = ENV['DATABASE_NAME'] || "#{Rails.application.class.module_parent_name.underscore}_#{Rails.env}"

      "postgresql://#{username}:#{password}@#{host}:#{port}/#{database}"
    end
  end
end

# Validate required secrets in production
if Rails.env.production?
  required_secrets = %w[jwt_secret_key database_url]

  missing_secrets = required_secrets.select do |secret|
    Secrets.send(secret).blank?
  end

  if missing_secrets.any?
    Rails.logger.error "Missing required secrets: #{missing_secrets.join(', ')}"
    Rails.logger.error "Please set these environment variables or add them to credentials"
    exit 1
  end
end

# Log secrets status (without exposing values)
Rails.logger.info "Secrets Management:"
Rails.logger.info "  JWT Secret: #{Secrets.jwt_secret_key.present? ? 'Configured' : 'Missing'}"
Rails.logger.info "  Database URL: #{Secrets.database_url.present? ? 'Configured' : 'Missing'}"
Rails.logger.info "  Redis URL: #{Secrets.redis_url.present? ? 'Configured' : 'Missing'}"
Rails.logger.info "  API Key: #{Secrets.api_key.present? ? 'Configured' : 'Missing'}"
