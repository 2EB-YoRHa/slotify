class WorkspacesController < InertiaController
  before_action :require_manager_or_admin!, except: %i[index show]
  before_action :set_workspace,
                only: %i[
                  show
                  edit
                  update
                  destroy
                  delete_confirmation
                ]
  before_action :ensure_workspace_slot_available!, only: %i[new create]

  def index
    serialized_workspaces = serialize_workspaces(workspace_scope.order(:name))

    respond_to do |format|
      format.html do
        render inertia: "workspaces/index", props: {
          workspaces: serialized_workspaces
        }
      end

      format.json do
        render json: serialized_workspaces
      end
    end
  end

  def show
    serialized_workspace = serialize_workspace(@workspace)
    serialized_reservations = member? ? [] : serialize_workspace_reservations
    reservation_count = member? ? nil : @workspace.reservations.count

    respond_to do |format|
      format.html do
        render inertia: "workspaces/show", props: {
          workspace: serialized_workspace,
          reservations: serialized_reservations,
          reservation_count: reservation_count
        }
      end

      format.json do
        render json: {
          workspace: serialized_workspace,
          reservations: serialized_reservations,
          reservation_count: reservation_count
        }
      end
    end
  end

  def new
    render inertia: "workspaces/new", props: workspace_form_props
  end

  def create
    workspace = current_organization.workspaces.build(workspace_attributes)
    extra_photos = extra_photo_files

    validation_error = validate_extra_photos(workspace, extra_photos)

    if validation_error.present?
      render_workspace_form_error(
        workspace,
        validation_error,
        page: "workspaces/new"
      )

      return
    end

    respond_to do |format|
      if workspace.save
        workspace.extra_photos.attach(extra_photos) if extra_photos.any?

        format.html do
            redirect_to workspaces_path,
                        notice: "Workspace created successfully",
                        status: :see_other
        end

        format.json do
          render json: serialize_workspace(workspace.reload),
                 status: :created
        end
      else
        format.html do
          render_workspace_form(
            page: "workspaces/new",
            workspace: workspace,
            status: :unprocessable_entity
          )
        end

        format.json do
          render_workspace_errors(workspace)
        end
      end
    end
  end

  def edit
    render inertia: "workspaces/edit", props: workspace_form_props(
      workspace: @workspace
    )
  end

  def update
    extra_photos = extra_photo_files
    removed_extra_photo_ids = remove_extra_photo_ids

    validation_error = validate_extra_photos(
      @workspace,
      extra_photos,
      removed_attachment_ids: removed_extra_photo_ids
    )

    if validation_error.present?
      render_workspace_form_error(
        @workspace,
        validation_error,
        page: "workspaces/edit"
      )

      return
    end

    respond_to do |format|
      if @workspace.update(workspace_attributes)
        purge_workspace_photo_if_requested
        purge_removed_extra_photos(removed_extra_photo_ids)

        @workspace.extra_photos.attach(extra_photos) if extra_photos.any?

        format.html do
          redirect_to workspaces_path,
                      notice: "Workspace updated successfully",
                      status: :see_other
        end

        format.json do
          render json: serialize_workspace(@workspace.reload)
        end
      else
        format.html do
          render_workspace_form(
            page: "workspaces/edit",
            workspace: @workspace,
            status: :unprocessable_entity
          )
        end

        format.json do
          render_workspace_errors(@workspace)
        end
      end
    end
  end

  def delete_confirmation
    render inertia: "workspaces/delete", props: delete_workspace_props
  end

  def destroy
    if @workspace.reservations.exists?
      render_workspace_delete_blocked
      return
    end

    @workspace.destroy

    respond_to do |format|
      format.html do
          redirect_to workspaces_path,
                      notice: "Workspace deleted successfully",
                      status: :see_other
      end

      format.json do
        render json: {
          message: "Workspace deleted successfully"
        }
      end
    end
  end

  private

    def workspace_scope
      scope = current_organization
              .workspaces
              .with_attached_photo
              .with_attached_extra_photos
              .includes(:amenities)

      member? ? scope.where(active: true) : scope
    end

    def set_workspace
      @workspace = workspace_scope.find(params[:id])
    end

    def workspace_form_props(workspace: nil)
      props = {
        amenities: amenities_for_form,
        multiple_workspace_photos_enabled: current_organization.multiple_workspace_photos_enabled?
      }

      return props unless workspace.present?

      props.merge(
        workspace: serialize_workspace(workspace),
        selected_amenity_ids: workspace.amenity_ids
      )
    end

    def amenities_for_form
      Amenity.order(:name)
    end

    def workspace_attributes
      params.require(:workspace).permit(
        :name,
        :workspace_type,
        :capacity,
        :floor,
        :zone,
        :location,
        :description,
        :hourly_rate,
        :active,
        :photo,
        amenity_ids: []
      )
    end

    def workspace_photo_file
      params.dig(:workspace, :photo)
    end

    def remove_workspace_photo?
      ActiveModel::Type::Boolean.new.cast(
        params.dig(:workspace, :remove_photo)
      )
    end

    def remove_extra_photo_ids
      raw_ids = params.dig(:workspace, :remove_extra_photo_ids)
      raw_ids = raw_ids.values if raw_ids.is_a?(ActionController::Parameters)

      Array(raw_ids).reject(&:blank?).map(&:to_i)
    end

    def extra_photo_files
      raw_files = params.dig(:workspace, :extra_photos)
      raw_files = raw_files.values if raw_files.is_a?(ActionController::Parameters)

      Array(raw_files).reject(&:blank?)
    end

    def purge_workspace_photo_if_requested
      return unless remove_workspace_photo?
      return if workspace_photo_file.present?
      return unless @workspace.photo.attached?

      @workspace.photo.purge
    end

    def purge_removed_extra_photos(attachment_ids)
      return if attachment_ids.blank?

      @workspace
        .extra_photos
        .attachments
        .where(id: attachment_ids)
        .find_each(&:purge)
    end

    def validate_extra_photos(
      workspace,
      files,
      removed_attachment_ids: []
    )
      Workspaces::ExtraPhotosValidator
        .new(
          organization: current_organization,
          workspace: workspace,
          files: files,
          removed_attachment_ids: removed_attachment_ids
        )
        .error_message
    end

    def render_workspace_form(page:, workspace:, status: :ok)
      render inertia: page,
             props: workspace_form_props_for(workspace),
             status: status
    end

    def workspace_form_props_for(workspace)
      props = workspace.persisted? ? workspace_form_props(workspace: workspace) : workspace_form_props

      props.merge(errors: workspace.errors.to_hash)
    end

    def render_workspace_form_error(workspace, message, page:)
      workspace.errors.add(:extra_photos, message)

      respond_to do |format|
        format.html do
          render_workspace_form(
            page: page,
            workspace: workspace,
            status: :unprocessable_entity
          )
        end

        format.json do
          render json: {
            errors: [ message ]
          }, status: :unprocessable_entity
        end
      end
    end

    def render_workspace_errors(workspace)
      render json: {
        errors: workspace.errors.full_messages
      }, status: :unprocessable_entity
    end

    def delete_workspace_props
      reservation_count = @workspace.reservations.count
      can_delete = reservation_count.zero?

      {
        workspace: serialize_workspace(@workspace),
        reservation_count: reservation_count,
        can_delete: can_delete,
        delete_error: delete_error_for(can_delete)
      }
    end

    def render_workspace_delete_blocked
      respond_to do |format|
        format.html do
          render inertia: "workspaces/delete",
                 props: delete_workspace_props,
                 status: :unprocessable_entity
        end

        format.json do
          render json: {
            errors: [ "Workspace has reservation history" ]
          }, status: :unprocessable_entity
        end
      end
    end

    def ensure_workspace_slot_available!
      return unless current_organization.workspace_limit_reached?

      message = "Your current plan has reached the workspace limit. Upgrade to Pro to add more workspaces."

      respond_to do |format|
        format.html do
          if action_name == "new"
            redirect_to subscription_path,
                        alert: message
          else
            render inertia: "workspaces/new",
                   props: workspace_form_props.merge(
                     errors: {
                       base: [ message ]
                     }
                   ),
                   status: :unprocessable_entity
          end
        end

        format.json do
          render json: {
            error: message,
            code: "workspace_limit_reached"
          }, status: :unprocessable_entity
        end
      end
    end

    def serialize_workspaces(workspaces)
      workspaces.map do |workspace|
        serialize_workspace(workspace)
      end
    end

    def serialize_workspace(workspace)
      WorkspaceSerializer
        .new(workspace, view_context: view_context)
        .as_json
    end

    def serialize_workspace_reservations
      @workspace
        .reservations
        .includes(user: { avatar_attachment: :blob })
        .order(start_time: :desc)
        .limit(10)
        .map do |reservation|
          reservation.as_json(
            only: %i[id start_time end_time status]
          ).merge(
            user: serialize_reservation_user(reservation.user)
          )
        end
    end

    def serialize_reservation_user(user)
      return nil unless user.present?

      user.as_json(
        only: %i[id name email]
      ).merge(
        avatar_url: user.avatar.attached? ? url_for(user.avatar) : nil
      )
    end

    def delete_error_for(can_delete)
      return nil if can_delete

      "This workspace has reservation history. Mark it as inactive instead of deleting it."
    end
end
