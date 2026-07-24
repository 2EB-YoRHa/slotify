class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  belongs_to :organization, optional: true
  belongs_to :role

  has_many :reservations, dependent: :destroy
  has_many :sent_invitations, class_name: "OrganizationInvitation", foreign_key: :invited_by_id

  validates :name, presence: true

  def active_for_authentication?
    super && active?
  end

  def inactive_message
    active? ? super : :inactive
  end
end
