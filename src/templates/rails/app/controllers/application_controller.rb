class ApplicationController < ActionController::API
  include JwtAuthenticatable

  # Add any common controller logic here

  def index
    render json: {
      message: "Welcome to <%= appName %> API",
      version: "1.0.0",
      endpoints: {
        graphql: "/graphql",
        health: "/health",
        <%= API_DOCS_ENDPOINT %>
        graphiql: "/graphiql"
      }
    }
  end

  # Override authenticate_user! for public endpoints
  def authenticate_user!
    # Skip authentication for public endpoints
    return if controller_name == 'application' && action_name == 'index'
    return if controller_name == 'auth' && %w[login register].include?(action_name)

    super
  end
end
