class WorkspacesController < InertiaController
  before_action :require_manager_or_admin!, except: %i[index show]
  before_action :set_workspace, only: %i[show edit update destroy delete_confirmation]
  before_action :ensure_workspace_slot_available!, only: %i[new create]

  def index
    workspaces = workspace_scope.order(:name)
    serialized_workspaces = serialize_workspaces(workspaces)

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
    serialized_reservations =
      if member?
        []
      else
        serialize_workspace_reservations(recent_workspace_reservations)
      end

    reservation_count = member? ? nil : @workspace.reservations.count

    respond_to do |format|
      format.html do
        render inertia: "workspaces/show", props: {
          workspace: serialize_workspace(@workspace),
          reservations: serialized_reservations,
          reservation_count: reservation_count
        }
      end

      format.json do
        render json: {
          workspace: serialize_workspace(@workspace),
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

    extra_photos_error = extra_photos_validation_error_for(workspace, extra_photos)

    if extra_photos_error.present?
      render_workspace_form_error(workspace, extra_photos_error, page: "workspaces/new")
      return
    end

    respond_to do |format|
      if workspace.save
        workspace.extra_photos.attach(extra_photos) if extra_photos.any?

        format.html do
          redirect_to workspaces_path,
                      notice: "Workspace created successfully"
        end

        format.json do
          render json: serialize_workspace(workspace.reload),
                status: :created
        end
      else
        format.html do
          render inertia: "workspaces/new",
                props: workspace_form_props.merge(
                  errors: workspace.errors.to_hash
                ),
                status: :unprocessable_entity
        end

        format.json do
          render json: {
            errors: workspace.errors.full_messages
          }, status: :unprocessable_entity
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
    extra_photos_error = extra_photos_validation_error_for(@workspace, extra_photos)

    if extra_photos_error.present?
      render_workspace_form_error(@workspace, extra_photos_error, page: "workspaces/edit")
      return
    end

    respond_to do |format|
      if @workspace.update(workspace_attributes)
        @workspace.extra_photos.attach(extra_photos) if extra_photos.any?

        format.html do
          redirect_to workspaces_path,
                      notice: "Workspace updated successfully"
        end

        format.json do
          render json: serialize_workspace(@workspace.reload)
        end
      else
        format.html do
          render inertia: "workspaces/edit",
                props: workspace_form_props(
                  workspace: @workspace
                ).merge(
                  errors: @workspace.errors.to_hash
                ),
                status: :unprocessable_entity
        end

        format.json do
          render json: {
            errors: @workspace.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end

  def delete_confirmation
    reservation_count = @workspace.reservations.count
    can_delete = reservation_count.zero?

    render inertia: "workspaces/delete", props: {
      workspace: serialize_workspace(@workspace),
      reservation_count: reservation_count,
      can_delete: can_delete,
      delete_error: delete_error_for(can_delete)
    }
  end

  def destroy
    if @workspace.reservations.exists?
      respond_to do |format|
        format.html do
          render inertia: "workspaces/delete",
                 props: {
                   workspace: serialize_workspace(@workspace),
                   reservation_count: @workspace.reservations.count,
                   can_delete: false,
                   delete_error: delete_error_for(false)
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: {
            errors: [
              "Workspace has reservation history"
            ]
          }, status: :unprocessable_entity
        end
      end

      return
    end

    @workspace.destroy

    respond_to do |format|
      format.html do
        redirect_to workspaces_path,
                    notice: "Workspace deleted successfully"
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

    def recent_workspace_reservations
      @workspace
        .reservations
        .includes(:user)
        .order(start_time: :desc)
        .limit(10)
    end

    def serialize_workspace_reservations(reservations)
      reservations.as_json(
        only: [
          :id,
          :start_time,
          :end_time,
          :status
        ],
        include: {
          user: {
            only: [
              :id,
              :name,
              :email
            ]
          }
        }
      )
    end

    def amenities_for_form
      Amenity.order(:name)
    end

    def workspace_form_props(workspace: nil)
      props = {
        amenities: amenities_for_form,
        multiple_workspace_photos_enabled: current_organization.multiple_workspace_photos_enabled?
      }

      if workspace.present?
        props.merge!(
          workspace: serialize_workspace(workspace),
          selected_amenity_ids: workspace.amenity_ids
        )
      end

      props
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

    def extra_photo_files
      raw_files = params.dig(:workspace, :extra_photos)

      return [] if raw_files.blank?

      if raw_files.is_a?(ActionController::Parameters)
        raw_files = raw_files.values
      end

      Array(raw_files).reject(&:blank?)
    end

    def extra_photos_validation_error_for(workspace, files)
      return nil if files.blank?

      unless current_organization.multiple_workspace_photos_enabled?
        return "Extra gallery photos are only available on the Pro plan."
      end

      current_count = workspace.persisted? ? workspace.extra_photos.attachments.size : 0
      next_count = current_count + files.size

      if next_count > Workspace::MAX_EXTRA_PHOTOS
        return "You can attach up to #{Workspace::MAX_EXTRA_PHOTOS} extra gallery photos."
      end

      invalid_file = files.find do |file|
        !file.content_type.in?(Workspace::ALLOWED_PHOTO_CONTENT_TYPES)
      end

      if invalid_file.present?
        return "Extra gallery photos must be PNG, JPG, JPEG, or WEBP images."
      end

      oversized_file = files.find do |file|
        file.size > Workspace::MAX_PHOTO_SIZE
      end

      if oversized_file.present?
        return "Each extra gallery photo must be less than 5MB."
      end

      nil
    end

    def render_workspace_form_error(workspace, message, page:)
      workspace.errors.add(:extra_photos, message)

      respond_to do |format|
        format.html do
          props =
            if workspace.persisted?
              workspace_form_props(workspace: workspace)
            else
              workspace_form_props
            end

          render inertia: page,
                props: props.merge(
                  errors: workspace.errors.to_hash
                ),
                status: :unprocessable_entity
        end

        format.json do
          render json: {
            errors: [ message ]
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

    def delete_error_for(can_delete)
      return nil if can_delete

      "This workspace has reservation history. Mark it as inactive instead of deleting it."
    end
end
