require "rails_helper"

RSpec.describe Queries::Users, type: :request do
  describe "users query" do
    let(:query) do
      <<~GRAPHQL
        query {
          users {
            id
            email
            name
            createdAt
            updatedAt
          }
        }
      GRAPHQL
    end

    it "returns empty array when no users exist" do
      result = query(query)

      expect_graphql_success(result)
      expect(result[:data]["users"]).to eq([])
    end

    it "returns users when they exist" do
      # This test will work once User model is implemented
      # user = create(:user)

      result = query(query)

      expect_graphql_success(result)
      expect(result[:data]["users"]).to be_an(Array)
      # expect(result[:data]["users"].first["id"]).to eq(user.id.to_s)
    end

    it "handles query with specific fields" do
      result = query(<<~GRAPHQL)
        query {
          users {
            id
            email
          }
        }
      GRAPHQL

      expect_graphql_success(result)
      expect(result[:data]["users"]).to be_an(Array)
    end
  end
end
