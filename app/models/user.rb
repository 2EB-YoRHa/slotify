class User < ApplicationRecord
  PASSWORD_REQUIREMENTS = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    symbol: /[^A-Za-z0-9]/
  }.freeze

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  belongs_to :organization, optional: true
  belongs_to :role

  has_many :reservations, dependent: :destroy
  has_many :sent_invitations,
           class_name: "OrganizationInvitation",
           foreign_key: :invited_by_id

  validates :name, presence: true

  validate :password_complexity,
           if: :password_required?

  def active_for_authentication?
    super && active?
  end

  def inactive_message
    active? ? super : :inactive
  end

  private

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
