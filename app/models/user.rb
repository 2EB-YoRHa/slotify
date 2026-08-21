class User < ApplicationRecord
  AVATAR_ALLOWED_CONTENT_TYPES = %w[image/png image/jpeg image/jpg image/webp].freeze
  MAX_AVATAR_SIZE = 5.megabytes

  PASSWORD_REQUIREMENTS = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    symbol: /[^A-Za-z0-9]/
  }.freeze

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable

  belongs_to :organization, optional: true
  belongs_to :role
  has_one_attached :avatar

  has_many :reservations, dependent: :destroy
  has_many :sent_invitations,
           class_name: "OrganizationInvitation",
           foreign_key: :invited_by_id

  validates :name, presence: true

  validate :password_complexity,
           if: :password_required?

  validate :acceptable_avatar

  def active_for_authentication?
    super && active?
  end

  def inactive_message
    active? ? super : :inactive
  end

  def two_factor_enabled?
    otp_required_for_login? && otp_secret.present?
  end

  def ensure_otp_secret!
    return otp_secret if otp_secret.present?

    update!(otp_secret: ROTP::Base32.random_base32)

    otp_secret
  end

  def otp_provisioning_uri
    ensure_otp_secret!

    ROTP::TOTP
      .new(
        otp_secret,
        issuer: "Slotify"
      )
      .provisioning_uri(email)
  end

  def verify_otp(code)
    return false if otp_secret.blank?

    normalized_code = code.to_s.gsub(/\s+/, "")

    return false unless normalized_code.match?(/\A\d{6}\z/)

    verified_at = totp.verify(
      normalized_code,
      drift_behind: 30,
      drift_ahead: 30,
      after: otp_last_used_at
    )

    return false unless verified_at

    update_column(:otp_last_used_at, verified_at)

    true
  end

  def enable_two_factor!
    ensure_otp_secret!

    update!(
      otp_required_for_login: true
    )
  end

  def disable_two_factor!
    update!(
      otp_secret: nil,
      otp_required_for_login: false,
      otp_last_used_at: nil
    )
  end

  private

  def totp
    ROTP::TOTP.new(otp_secret, issuer: "Slotify")
  end

  def acceptable_avatar
    return unless avatar.attached?

    unless avatar.blob.content_type.in?(AVATAR_ALLOWED_CONTENT_TYPES)
      errors.add(:avatar, "must be a PNG, JPG, JPEG, or WEBP image")
    end

    if avatar.blob.byte_size > MAX_AVATAR_SIZE
      errors.add(:avatar, "must be less than 5MB")
    end
  end

  def password_complexity
    return if password.blank?

    unless password.match?(PASSWORD_REQUIREMENTS[:uppercase])
      errors.add(:password, "must include at least one uppercase letter")
    end

    unless password.match?(PASSWORD_REQUIREMENTS[:lowercase])
      errors.add(:password, "must include at least one lowercase letter")
    end

    unless password.match?(PASSWORD_REQUIREMENTS[:number])
      errors.add(:password, "must include at least one number")
    end

    unless password.match?(PASSWORD_REQUIREMENTS[:symbol])
      errors.add(:password, "must include at least one symbol")
    end
  end
end
