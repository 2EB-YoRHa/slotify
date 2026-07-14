class Role < ApplicationRecord
  has_many :users
  has_many :organization_invitations

  validates :name, presence: true, uniqueness: true
end
