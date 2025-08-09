Rails.application.routes.draw do
  # Authentication endpoints
  namespace :auth do
    post :login
    post :register
    get :me
    post :logout
    post :refresh
  end

  # GraphQL endpoint
  post "/graphql", to: "graphql#execute"

  # Redirect GET /graphql to GraphiQL in development
  if Rails.env.development?
    get "/graphql", to: redirect("/graphiql")
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  <%= API_DOCS_ROUTES %>

  # Health check endpoint
  get "/health", to: proc { [200, {}, ["OK"]] }

  # Root endpoint
  root "application#index"
end
