class Workspace < ApplicationRecord
  belongs_to :organization

  has_many :workspace_amenities, dependent: :destroy
  has_many :amenities, through: :workspace_amenities

  has_many :reservations, dependent: :destroy

  validates :name, presence: true
  validates :workspace_type, presence: true
  validates :capacity, presence: true, numericality: { greater_than: 0 }
end