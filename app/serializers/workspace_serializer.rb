class WorkspaceSerializer
  WORKSPACE_ATTRIBUTES = [
    :id,
    :name,
    :workspace_type,
    :capacity,
    :floor,
    :zone,
    :location,
    :description,
    :hourly_rate,
    :active
  ].freeze

  def initialize(workspace, view_context:)
    @workspace = workspace
    @view_context = view_context
  end

  def as_json
    workspace.as_json(
      only: WORKSPACE_ATTRIBUTES,
      include: {
        amenities: {
          only: [
            :id,
            :name
          ]
        }
      }
    ).merge(
      photo_attached: workspace.photo.attached?,
      photo_url: photo_url,
      photo_filename: photo_filename,
      extra_photos: extra_photos,
      gallery_photos: gallery_photos,
      multiple_workspace_photos_enabled: workspace.organization.multiple_workspace_photos_enabled?
    )
  end

  private

  attr_reader :workspace, :view_context

  def photo_url
    return nil unless workspace.photo.attached?

    view_context.url_for(workspace.photo)
  end

  def photo_filename
    return nil unless workspace.photo.attached?

    workspace.photo.filename.to_s
  end

  def extra_photos
    return [] unless workspace.extra_photos.attached?

    workspace.extra_photos.map do |extra_photo|
      serialize_photo(extra_photo)
    end
  end

  def gallery_photos
    workspace.gallery_photos.map do |gallery_photo|
      serialize_photo(gallery_photo)
    end
  end

  def serialize_photo(attachment)
    {
      id: attachment.id,
      url: view_context.url_for(attachment),
      filename: attachment.filename.to_s,
      content_type: attachment.blob.content_type,
      byte_size: attachment.blob.byte_size
    }
  end
end
