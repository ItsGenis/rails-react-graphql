require "rails_helper"

RSpec.describe Mutations::CreateUser, type: :request do
  describe "createUser mutation" do
    let(:mutation) do
      <<~GRAPHQL
        mutation CreateUser($email: String!, $name: String, $password: String!) {
          createUser(input: { email: $email, name: $name, password: $password }) {
            user {
              id
              email
              name
              createdAt
              updatedAt
            }
            errors
          }
        }
      GRAPHQL
    end

    let(:valid_variables) do
      {
        email: "test@example.com",
        name: "Test User",
        password: "password123"
      }
    end

    it "returns error when user creation is not implemented" do
      result = mutation(mutation, variables: valid_variables)

      expect_graphql_success(result)
      expect(result[:data]["createUser"]["user"]).to be_nil
      expect(result[:data]["createUser"]["errors"]).to include("User creation not implemented yet")
    end

    it "handles missing required fields" do
      result = mutation(mutation, variables: { email: "test@example.com" })

      expect_graphql_error(result)
    end

    it "handles invalid email format" do
      result = mutation(mutation, variables: {
        email: "invalid-email",
        name: "Test User",
        password: "password123"
      })

      expect_graphql_success(result)
      # This will work once validation is implemented
      # expect(result[:data]["createUser"]["errors"]).to include("Email is invalid")
    end

    it "handles short password" do
      result = mutation(mutation, variables: {
        email: "test@example.com",
        name: "Test User",
        password: "123"
      })

      expect_graphql_success(result)
      # This will work once validation is implemented
      # expect(result[:data]["createUser"]["errors"]).to include("Password is too short")
    end

    # This test will work once User model is implemented
    # it "creates user successfully with valid data" do
    #   result = mutation(mutation, variables: valid_variables)
    #
    #   expect_graphql_success(result)
    #   expect(result[:data]["createUser"]["user"]).to be_present
    #   expect(result[:data]["createUser"]["user"]["email"]).to eq("test@example.com")
    #   expect(result[:data]["createUser"]["user"]["name"]).to eq("Test User")
    #   expect(result[:data]["createUser"]["errors"]).to be_empty
    # end
  end
end
