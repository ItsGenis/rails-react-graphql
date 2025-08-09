# frozen_string_literal: true

class AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:login, :register]

  # POST /auth/login
  def login
    user = User.find_by(email: params[:email]&.downcase)

    if user&.authenticate(params[:password])
      token = user.generate_jwt_token
      render json: {
        token: token,
        user: user.as_json,
        message: 'Login successful'
      }, status: :ok
    else
      render json: {
        error: 'Invalid email or password'
      }, status: :unauthorized
    end
  end

  # POST /auth/register
  def register
    user = User.new(user_params)

    if user.save
      token = user.generate_jwt_token
      render json: {
        token: token,
        user: user.as_json,
        message: 'Registration successful'
      }, status: :created
    else
      render json: {
        error: 'Registration failed',
        details: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # GET /auth/me
  def me
    render json: {
      user: current_user.as_json
    }, status: :ok
  end

  # POST /auth/logout
  def logout
    # In a stateless JWT system, logout is handled client-side
    # by removing the token. This endpoint can be used for logging.
    render json: {
      message: 'Logout successful'
    }, status: :ok
  end

  # POST /auth/refresh
  def refresh
    # Generate a new token for the current user
    token = current_user.generate_jwt_token
    render json: {
      token: token,
      message: 'Token refreshed'
    }, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation)
  end
end
