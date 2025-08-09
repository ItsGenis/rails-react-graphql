module Queries
  class Users < Queries::BaseQuery
    type [Types::UserType], null: false
    description "Get all users"

    def resolve
      # This is a placeholder - replace with actual User model query
      # User.all
      []
    end
  end
end
