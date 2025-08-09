# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  has_secure_password

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :password, length: { minimum: 6 }, if: -> { password.present? }

  # Callbacks
  before_save :downcase_email

  # Instance methods
  def generate_jwt_token
    JWT.encode(
      {
        user_id: id,
        email: email,
        exp: 24.hours.from_now.to_i
      },
      Rails.application.credentials.secret_key_base,
      'HS256'
    )
  end

  def as_json(options = {})
    super(options.merge(
      except: [:password_digest],
      methods: [:created_at_formatted, :updated_at_formatted]
    ))
  end

  def created_at_formatted
    created_at&.strftime('%Y-%m-%d %H:%M:%S')
  end

  def updated_at_formatted
    updated_at&.strftime('%Y-%m-%d %H:%M:%S')
  end

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end
end
