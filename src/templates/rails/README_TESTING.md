# Testing Guide

This guide covers the testing setup and how to write and run tests for your <%= appName %> Rails application.

## Test Framework

The application uses **RSpec** as the primary testing framework with the following testing tools:

- **RSpec** - Main testing framework
- **FactoryBot** - Test data generation
- **Faker** - Fake data generation
- **Shoulda Matchers** - Rails-specific matchers
- **Database Cleaner** - Test isolation
- **Capybara** - Integration testing (when needed)

## Running Tests

### Run All Tests
```bash
bundle exec rspec
```

### Run Specific Test Files
```bash
# Run only request specs
bundle exec rspec spec/requests/

# Run only GraphQL specs
bundle exec rspec spec/graphql/

# Run a specific test file
bundle exec rspec spec/requests/graphql_spec.rb
```

### Run Tests with Coverage
```bash
# Install SimpleCov gem first
bundle add simplecov --group test

# Run tests with coverage
COVERAGE=true bundle exec rspec
```

### Run Tests in Parallel
```bash
# Install parallel_tests gem first
bundle add parallel_tests --group test

# Run tests in parallel
bundle exec parallel_rspec spec/
```

## Test Structure

```
spec/
├── spec_helper.rb              # Main RSpec configuration
├── support/                    # Test support files
│   ├── factory_bot.rb         # Factory definitions
│   ├── graphql_test_helpers.rb # GraphQL test helpers
│   └── database_cleaner.rb    # Database cleanup
├── requests/                   # Request specs (API endpoints)
│   ├── application_spec.rb    # Application endpoints
│   └── graphql_spec.rb        # GraphQL endpoints
└── graphql/                    # GraphQL-specific specs
    ├── queries/               # Query specs
    │   └── users_spec.rb
    └── mutations/             # Mutation specs
        └── create_user_spec.rb
```

## Writing Tests

### Request Specs

Test API endpoints and HTTP responses:

```ruby
require "rails_helper"

RSpec.describe "API Endpoints", type: :request do
  describe "GET /health" do
    it "returns health status" do
      get "/health"

      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)["status"]).to eq("healthy")
    end
  end
end
```

### GraphQL Specs

Test GraphQL queries and mutations:

```ruby
require "rails_helper"

RSpec.describe Queries::Users, type: :request do
  it "returns users" do
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
```

### Using Factories

Create test data with FactoryBot:

```ruby
# Create a user
user = create(:user)

# Create a user with specific attributes
user = create(:user, email: "test@example.com")

# Build without saving
user = build(:user)

# Create multiple users
users = create_list(:user, 3)
```

### GraphQL Test Helpers

Use the provided GraphQL test helpers:

```ruby
# Execute a GraphQL query
result = query(query_string, variables: { id: 1 })

# Execute a GraphQL mutation
result = mutation(mutation_string, variables: { email: "test@example.com" })

# Test for success
expect_graphql_success(result)

# Test for errors
expect_graphql_error(result, message: "User not found")

# Create context with authentication
context = graphql_context(user: current_user)
result = query(query_string, context: context)
```

## Test Configuration

### RSpec Configuration

The main configuration is in `spec/spec_helper.rb`:

- **FactoryBot** - Included for all specs
- **Shoulda Matchers** - Rails-specific matchers
- **Database Cleaner** - Automatic test isolation
- **GraphQL Helpers** - Custom GraphQL testing helpers

### Database Cleaner

Tests are isolated using Database Cleaner:

- **Transaction strategy** - Fast, for most tests
- **Truncation strategy** - For JavaScript tests
- **Automatic cleanup** - Between each test

### FactoryBot

Factories are defined in `spec/support/factory_bot.rb`:

```ruby
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { Faker::Name.name }
    password { "password123" }
  end
end
```

## Best Practices

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the behavior
3. **Follow the Arrange-Act-Assert pattern**
4. **Test both success and failure cases**

### GraphQL Testing

1. **Test the schema** - Ensure queries and mutations exist
2. **Test validation** - Check error handling
3. **Test authentication** - Verify protected endpoints
4. **Use variables** - Don't hardcode values in queries

### Performance

1. **Use transactions** for fast test isolation
2. **Minimize database calls** in tests
3. **Use factories sparingly** - Only create necessary data
4. **Run tests in parallel** for faster feedback

## Continuous Integration

### GitHub Actions

Add this to your `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v2
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2.0
          bundler-cache: true
      - run: |
          sudo apt-get update
          sudo apt-get install -y postgresql-client
      - run: |
          bundle install
          bundle exec rails db:create
          bundle exec rails db:schema:load
          bundle exec rspec
```

### Environment Variables

Set these in your CI environment:

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
RAILS_ENV=test
```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure PostgreSQL is running
   - Check database credentials in test environment

2. **Factory errors**
   - Verify factories are properly defined
   - Check for missing required attributes

3. **GraphQL test failures**
   - Ensure schema is properly loaded
   - Check query/mutation syntax

4. **Slow tests**
   - Use transaction strategy for Database Cleaner
   - Minimize database calls
   - Run tests in parallel

### Debugging

1. **Run tests with verbose output**:
   ```bash
   bundle exec rspec --format documentation
   ```

2. **Run a single test**:
   ```bash
   bundle exec rspec spec/requests/graphql_spec.rb:15
   ```

3. **Use debugging statements**:
   ```ruby
   it "debugs the issue" do
     result = query(query_string)
     puts result.inspect
     expect(result).to be_present
   end
   ```
