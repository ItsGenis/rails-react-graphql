require 'swagger_helper'

RSpec.describe 'Authentication API', swagger_doc: 'v1/swagger.yaml' do
  path '/auth/login' do
    post 'User login' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string, format: :email, example: 'user@example.com' },
          password: { type: :string, format: :password, example: 'password123' }
        },
        required: %w[email password]
      }

      response '200', 'login successful' do
        let(:user) { create(:user, email: 'user@example.com', password: 'password123') }
        let(:credentials) { { email: user.email, password: 'password123' } }

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['token']).to be_present
          expect(data['user']['email']).to eq(user.email)
          expect(data['message']).to eq('Login successful')
        end
      end

      response '401', 'invalid credentials' do
        let(:credentials) { { email: 'invalid@example.com', password: 'wrongpassword' } }

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['error']).to eq('Invalid email or password')
        end
      end
    end
  end

  path '/auth/register' do
    post 'User registration' do
      tags 'Authentication'
      consumes 'application/json'
      produces 'application/json'

      parameter name: :user_data, in: :body, schema: {
        type: :object,
        properties: {
          user: {
            type: :object,
            properties: {
              email: { type: :string, format: :email, example: 'user@example.com' },
              name: { type: :string, example: 'John Doe' },
              password: { type: :string, format: :password, example: 'password123' },
              password_confirmation: { type: :string, format: :password, example: 'password123' }
            },
            required: %w[email name password password_confirmation]
          }
        },
        required: %w[user]
      }

      response '201', 'registration successful' do
        let(:user_data) do
          {
            user: {
              email: 'newuser@example.com',
              name: 'New User',
              password: 'password123',
              password_confirmation: 'password123'
            }
          }
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['token']).to be_present
          expect(data['user']['email']).to eq('newuser@example.com')
          expect(data['message']).to eq('Registration successful')
        end
      end

      response '422', 'validation errors' do
        let(:user_data) do
          {
            user: {
              email: 'invalid-email',
              name: '',
              password: '123',
              password_confirmation: '456'
            }
          }
        end

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['error']).to eq('Registration failed')
          expect(data['details']).to be_an(Array)
        end
      end
    end
  end

  path '/auth/me' do
    get 'Get current user' do
      tags 'Authentication'
      produces 'application/json'
      security [BearerAuth: []]

      response '200', 'current user info' do
        let(:user) { create(:user) }
        let(:Authorization) { "Bearer #{user.generate_jwt_token}" }

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['user']['id']).to eq(user.id)
          expect(data['user']['email']).to eq(user.email)
        end
      end

      response '401', 'authentication required' do
        let(:Authorization) { 'Bearer invalid-token' }

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['error']).to eq('Authentication required')
        end
      end
    end
  end

  path '/auth/logout' do
    post 'User logout' do
      tags 'Authentication'
      produces 'application/json'
      security [BearerAuth: []]

      response '200', 'logout successful' do
        let(:user) { create(:user) }
        let(:Authorization) { "Bearer #{user.generate_jwt_token}" }

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['message']).to eq('Logout successful')
        end
      end
    end
  end

  path '/auth/refresh' do
    post 'Refresh token' do
      tags 'Authentication'
      produces 'application/json'
      security [BearerAuth: []]

      response '200', 'token refreshed' do
        let(:user) { create(:user) }
        let(:Authorization) { "Bearer #{user.generate_jwt_token}" }

        run_test! do |response|
          data = JSON.parse(response.body)
          expect(data['token']).to be_present
          expect(data['message']).to eq('Token refreshed')
        end
      end
    end
  end
end
