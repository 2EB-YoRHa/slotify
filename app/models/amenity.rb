class Amenity < ApplicationRecord
  has_many :workspace_amenities, dependent: :destroy
  has_many :workspaces, through: :workspace_amenities

  validates :name, presence: true, uniqueness: true
end
