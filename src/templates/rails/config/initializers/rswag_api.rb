# Rswag API Configuration
Rswag::Api.configure do |c|
  # Set the root path for the API documentation
  c.swagger_root = Rails.root.to_s + '/swagger'

  # Set the path for the swagger JSON file
  c.swagger_filter = lambda { |swagger, env|
    swagger
  }
end
