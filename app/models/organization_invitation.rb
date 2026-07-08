class OrganizationInvitation < ApplicationRecord
  belongs_to :organization
  belongs_to :invited_by, class_name: "User"
  belongs_to :role

  validates :email, presence: true
  validates :token, presence: true, uniqueness: true
  validates :status, presence: true
end
