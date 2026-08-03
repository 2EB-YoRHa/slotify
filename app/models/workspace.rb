class Workspace < ApplicationRecord
  WORKSPACE_TYPES = %w[
    meeting_room
    private_office
    open_desk
    training_room
    phone_booth
  ].freeze

  belongs_to :organization

  has_one_attached :photo

  has_many :workspace_amenities, dependent: :destroy
  has_many :amenities, through: :workspace_amenities

  has_many :reservations, dependent: :destroy

  validates :name,
            presence: true,
            length: {
              minimum: 3,
              maximum: 80
            }

  validates :workspace_type,
            presence: true,
            inclusion: {
              in: WORKSPACE_TYPES
            }

  validates :capacity,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than: 0,
              less_than_or_equal_to: 200
            }

  validates :hourly_rate,
            presence: true,
            numericality: {
              greater_than_or_equal_to: 0,
              less_than_or_equal_to: 10_000
            }

  validates :floor,
            length: {
              maximum: 30
            },
            allow_blank: true

  validates :zone,
            length: {
              maximum: 80
            },
            allow_blank: true

  validates :location,
            presence: true,
            length: {
              maximum: 120
            }

  validates :description,
            length: {
              maximum: 500
            },
            allow_blank: true

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
