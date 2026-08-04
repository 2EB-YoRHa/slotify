class Amenity < ApplicationRecord
  has_many :workspace_amenities, dependent: :destroy
  has_many :workspaces, through: :workspace_amenities

  before_validation :normalize_name

  validates :name,
            presence: true,
            uniqueness: {
              case_sensitive: false
            },
            length: {
              minimum: 2,
              maximum: 60
            }

  private

  def normalize_name
    self.name = name.to_s.strip
  end
end
