class Workspace < ApplicationRecord
  belongs_to :organization

  has_one_attached :photo

  has_many :workspace_amenities, dependent: :destroy
  has_many :amenities, through: :workspace_amenities

  has_many :reservations, dependent: :destroy

  validates :name, presence: true
  validates :workspace_type, presence: true
  validates :capacity, presence: true, numericality: { greater_than: 0 }

  validate :acceptable_photo

  private

  def acceptable_photo
    return unless photo.attached?

    unless photo.blob.content_type.in?(
      [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/webp"
      ]
    )
      errors.add(:photo, "must be a PNG, JPG, JPEG, or WEBP image")
    end

    if photo.blob.byte_size > 5.megabytes
      errors.add(:photo, "must be less than 5MB")
    end
  end
end
