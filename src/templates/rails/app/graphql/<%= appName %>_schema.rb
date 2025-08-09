class <%= appName %>Schema < GraphQL::Schema
  # GraphQL configuration
  # These are the default settings for modern GraphQL-Ruby

  # Error handling
  rescue_from(ActiveRecord::RecordNotFound) do |err, obj, args, ctx, field|
    raise GraphQL::ExecutionError.new("#{field.type.unwrap.graphql_name} not found", extensions: { code: 'NOT_FOUND' })
  end

  rescue_from(ActiveRecord::RecordInvalid) do |err, obj, args, ctx, field|
    raise GraphQL::ExecutionError.new(err.record.errors.full_messages.join(', '), extensions: { code: 'VALIDATION_ERROR' })
  end

  def self.type_error(err, context)
    # Log error for debugging
    Rails.logger.error("GraphQL Error: #{err.message}")
    super
  end

  def self.unauthorized_object(error)
    # Log unauthorized access attempts
    Rails.logger.warn("GraphQL Unauthorized: #{error.message}")
    raise GraphQL::ExecutionError.new("Unauthorized", extensions: { code: 'UNAUTHORIZED' })
  end
end
