class Organization < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :workspaces, dependent: :destroy
  has_many :reservations, dependent: :destroy
  has_many :subscriptions, dependent: :destroy
  has_many :organization_invitations, dependent: :destroy
  has_one :booking_rule, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true
end
