# FactoryBot configuration
RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end

# Define factories here
FactoryBot.define do
  # Example User factory
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    sequence(:name) { |n| "User #{n}" }
    password { "password123" }
    password_confirmation { "password123" }
  end

  # Add more factories as needed
  # factory :post do
  #   title { Faker::Lorem.sentence }
  #   content { Faker::Lorem.paragraph }
  #   user
  # end
end
