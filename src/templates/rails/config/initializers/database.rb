# Database Configuration Initializer
# Load environment variables for database configuration

# Load .env file if it exists
if File.exist?('.env')
  require 'dotenv'
  Dotenv.load('.env')
end

# Set default database configuration
Rails.application.config.after_initialize do
  # Log database configuration (without sensitive data)
  Rails.logger.info "Database Configuration:"
  Rails.logger.info "  Adapter: #{Rails.application.config.database_configuration[Rails.env]['adapter']}"
  Rails.logger.info "  Database: #{Rails.application.config.database_configuration[Rails.env]['database']}"
  Rails.logger.info "  Host: #{Rails.application.config.database_configuration[Rails.env]['host'] || 'default'}"
  Rails.logger.info "  Port: #{Rails.application.config.database_configuration[Rails.env]['port'] || 'default'}"
  Rails.logger.info "  Username: #{Rails.application.config.database_configuration[Rails.env]['username'] || 'default'}"
end
