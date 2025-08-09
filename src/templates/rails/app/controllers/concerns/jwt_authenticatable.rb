# frozen_string_literal: true

module JwtAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!
  end

  private

  def authenticate_user!
    header = request.headers['Authorization']
    token = header.split(' ').last if header

    begin
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })
      @current_user = User.find(decoded[0]['user_id'])
    rescue ActiveRecord::RecordNotFound => e
      render json: { error: 'User not found' }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { error: 'Invalid token' }, status: :unauthorized
    rescue JWT::ExpiredSignature => e
      render json: { error: 'Token expired' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def user_signed_in?
    !!current_user
  end

  def authenticate_user!
    unless user_signed_in?
      render json: { error: 'Authentication required' }, status: :unauthorized
    end
  end
end
