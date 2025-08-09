# Application Configuration Initializer
# Loads configuration from config/application.yml and makes it available via AppConfig

require 'yaml'

# Load application configuration
config_file = Rails.root.join('config', 'application.yml')
if File.exist?(config_file)
  config = YAML.load(ERB.new(File.read(config_file)).result, aliases: true)
  env_config = config[Rails.env] || config['defaults'] || {}
else
  env_config = {}
end

# Create AppConfig module for easy access to configuration
module AppConfig
  class << self
    def method_missing(method_name, *args, &block)
      if env_config.key?(method_name.to_s)
        env_config[method_name.to_s]
      else
        super
      end
    end

    def respond_to_missing?(method_name, include_private = false)
      env_config.key?(method_name.to_s) || super
    end

    def all
      env_config
    end

    def reload!
      load_config
    end

    private

    def env_config
      @env_config ||= load_config
    end

    def load_config
      config_file = Rails.root.join('config', 'application.yml')
      if File.exist?(config_file)
        config = YAML.load(ERB.new(File.read(config_file)).result, aliases: true)
        config[Rails.env] || config['defaults'] || {}
      else
        {}
      end
    end
  end
end

# Log configuration on startup (without sensitive data)
Rails.logger.info "Application Configuration Loaded:"
Rails.logger.info "  Environment: #{Rails.env}"
Rails.logger.info "  App Name: #{AppConfig.app_name}"
Rails.logger.info "  App URL: #{AppConfig.app_url}"
Rails.logger.info "  Database: #{AppConfig.database_name}"
Rails.logger.info "  GraphQL Max Complexity: #{AppConfig.graphql_max_complexity}"
Rails.logger.info "  JWT Expiration: #{AppConfig.jwt_expiration_hours} hours"
