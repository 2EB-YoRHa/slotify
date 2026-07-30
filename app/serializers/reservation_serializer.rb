class ReservationSerializer
  RESERVATION_ATTRIBUTES = [
    :id,
    :workspace_id,
    :user_id,
    :organization_id,
    :start_time,
    :end_time,
    :status,
    :attendees_count,
    :notes,
    :total_price,
    :created_at,
    :updated_at
  ].freeze

  USER_ATTRIBUTES = [
    :id,
    :name,
    :email
  ].freeze

  def initialize(reservation, view_context:)
    @reservation = reservation
    @view_context = view_context
  end

  def as_json
    reservation.as_json(
      only: RESERVATION_ATTRIBUTES
    ).merge(
      workspace: serialized_workspace,
      user: serialized_user
    )
  end

  private

  attr_reader :reservation, :view_context

  def serialized_workspace
    return nil unless reservation.workspace.present?

    WorkspaceSerializer
      .new(reservation.workspace, view_context: view_context)
      .as_json
  end

  def serialized_user
    return nil unless reservation.user.present?

    reservation.user.as_json(
      only: USER_ATTRIBUTES
    )
  end
end
