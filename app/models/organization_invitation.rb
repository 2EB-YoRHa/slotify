class OrganizationInvitation < ApplicationRecord
  belongs_to :organization
  belongs_to :invited_by, class_name: "User"
  belongs_to :role

  before_validation :normalize_email
  before_validation :set_defaults, on: :create

  validates :email, presence: true
  validates :token, presence: true, uniqueness: true
  validates :status, presence: true
  validates :expires_at, presence: true

  validate :email_is_not_already_member, on: :create
  validate :email_does_not_have_pending_invitation, on: :create

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end

  def set_defaults
    self.token ||= SecureRandom.hex(24)
    self.status ||= "pending"
    self.expires_at ||= 7.days.from_now
  end

  def email_is_not_already_member
    return if email.blank? || organization.blank?

    if organization.users.exists?(email: email)
      errors.add(:email, "already belongs to this organization")
    end
  end

  def email_does_not_have_pending_invitation
    return if email.blank? || organization.blank?

    existing_invitation = organization
      .organization_invitations
      .where(email: email, status: "pending")
      .where("expires_at > ?", Time.current)

    existing_invitation = existing_invitation.where.not(id: id) if persisted?

    if existing_invitation.exists?
      errors.add(:email, "already has a pending invitation")
    end
  end
end
