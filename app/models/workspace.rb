class Workspace < ApplicationRecord
  WORKSPACE_TYPES = %w[
    meeting_room
    private_office
    open_desk
    training_room
    phone_booth
  ].freeze

  ALLOWED_PHOTO_CONTENT_TYPES = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/webp"
  ].freeze

  MAX_PHOTO_SIZE = 5.megabytes
  MAX_EXTRA_PHOTOS = 5

  belongs_to :organization

  has_one_attached :photo
  has_many_attached :extra_photos

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
  validate :extra_photos_allowed_by_plan
  validate :extra_photos_limit
  validate :acceptable_extra_photos

  def gallery_photos
    photos = []

    if photo.attached?
      photos << photo
    end

    photos.concat(extra_photos.attachments) if extra_photos.attached?

    photos
  end

  private

  def acceptable_photo
    return unless photo.attached?

    validate_photo_attachment(photo, :photo)
  end

  def extra_photos_allowed_by_plan
    return unless extra_photos.attached?
    return if organization&.multiple_workspace_photos_enabled?

    errors.add(
      :extra_photos,
      "are only available on the Pro plan"
    )
  end

  def extra_photos_limit
    return unless extra_photos.attached?

    if extra_photos.attachments.size > MAX_EXTRA_PHOTOS
      errors.add(
        :extra_photos,
        "cannot include more than #{MAX_EXTRA_PHOTOS} photos"
      )
    end
  end

  def acceptable_extra_photos
    return unless extra_photos.attached?

    extra_photos.each do |extra_photo|
      validate_photo_attachment(extra_photo, :extra_photos)
    end
  end

  def validate_photo_attachment(attachment, attribute)
    unless attachment.blob.content_type.in?(ALLOWED_PHOTO_CONTENT_TYPES)
      errors.add(
        attribute,
        "must be a PNG, JPG, JPEG, or WEBP image"
      )
    end

    return unless attachment.blob.byte_size > MAX_PHOTO_SIZE

    errors.add(
      attribute,
      "must be less than 5MB"
    )
  end
end
