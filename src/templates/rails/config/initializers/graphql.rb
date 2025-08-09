# GraphQL Configuration
Rails.application.config.after_initialize do
  # Enable GraphQL query complexity analysis
  <%= appName %>Schema.max_complexity = 1000

  # Enable GraphQL query depth analysis
  <%= appName %>Schema.max_depth = 20

  # Configure GraphQL development tools
  if Rails.env.development?
    # GraphiQL will use default configuration
  end
end
