# GraphQL Test Helpers
module GraphQL::TestHelpers
  def execute_graphql_query(query, variables: {}, context: {})
    result = <%= appName %>Schema.execute(
      query,
      variables: variables.deep_stringify_keys,
      context: context
    )

    # Return both the result and any errors
    {
      result: result,
      errors: result["errors"],
      data: result["data"]
    }
  end

  def execute_graphql_mutation(mutation, variables: {}, context: {})
    execute_graphql_query(mutation, variables: variables, context: context)
  end

  # Helper for testing GraphQL queries
  def query(query_string, variables: {}, context: {})
    execute_graphql_query(query_string, variables: variables, context: context)
  end

  # Helper for testing GraphQL mutations
  def mutation(mutation_string, variables: {}, context: {})
    execute_graphql_mutation(mutation_string, variables: variables, context: context)
  end

  # Helper to create a GraphQL context with authentication
  def graphql_context(user: nil, token: nil)
    context = {}
    context[:current_user] = user if user
    context[:token] = token if token
    context
  end

  # Helper to test GraphQL errors
  def expect_graphql_error(result, message: nil, path: nil)
    expect(result[:errors]).to be_present

    if message
      error_messages = result[:errors].map { |error| error["message"] }
      expect(error_messages).to include(message)
    end

    if path
      error_paths = result[:errors].map { |error| error["path"] }
      expect(error_paths).to include(path)
    end
  end

  # Helper to test GraphQL success
  def expect_graphql_success(result)
    expect(result[:errors]).to be_nil
    expect(result[:data]).to be_present
  end
end

RSpec.configure do |config|
  config.include GraphQL::TestHelpers, type: :request
end
