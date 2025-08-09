require "rails_helper"

RSpec.describe "GraphQL", type: :request do
  describe "POST /graphql" do
    let(:query) do
      <<~GRAPHQL
        query {
          health
        }
      GRAPHQL
    end

    it "returns health check" do
      post "/graphql", params: { query: query }

      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response["data"]["health"]).to eq("OK")
    end

    it "handles invalid queries" do
      post "/graphql", params: { query: "invalid query" }

      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)
      expect(json_response["errors"]).to be_present
    end
  end

  describe "GraphQL Schema" do
    it "has health query" do
      result = query(<<~GRAPHQL)
        query {
          health
        }
      GRAPHQL

      expect_graphql_success(result)
      expect(result[:data]["health"]).to eq("OK")
    end

    it "has users query" do
      result = query(<<~GRAPHQL)
        query {
          users {
            id
            email
            name
          }
        }
      GRAPHQL

      expect_graphql_success(result)
      expect(result[:data]["users"]).to be_an(Array)
    end

    it "has createUser mutation" do
      result = mutation(<<~GRAPHQL, variables: {
        email: "test@example.com",
        name: "Test User",
        password: "password123"
      })
        mutation CreateUser($email: String!, $name: String, $password: String!) {
          createUser(input: { email: $email, name: $name, password: $password }) {
            user {
              id
              email
              name
            }
            errors
          }
        }
      GRAPHQL

      expect_graphql_success(result)
      # Note: This will return errors since User model is not implemented yet
      expect(result[:data]["createUser"]["errors"]).to be_present
    end
  end
end
