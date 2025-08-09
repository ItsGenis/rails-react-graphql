module Types
  class QueryType < Types::BaseObject
    # Add `node` and `nodes` fields for Relay
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Health check endpoint
    field :health, String, null: false,
      description: "Health check endpoint for the API"

    def health
      "OK"
    end

    # Example query for users
    field :users, resolver: Queries::Users,
      description: "Get all users"

    # Add your root level fields here.
    # They will be entry points for queries on your schema.
  end
end
