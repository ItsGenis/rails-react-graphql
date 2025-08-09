module Types
  class MutationType < Types::BaseObject
    # Example mutation for creating users
    field :create_user, mutation: Mutations::CreateUser,
      description: "Create a new user"

    # Add your root level mutations here.
    # They will be entry points for mutations on your schema.
  end
end
