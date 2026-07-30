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
      photo_filename: photo_filename
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
end
