class WorkspacesController < InertiaController
  before_action :require_manager_or_admin!, except: %i[index show]
  before_action :set_workspace, only: %i[show edit update destroy delete_confirmation]

  def index
    workspaces = current_organization
                 .workspaces
                 .with_attached_photo
                 .includes(:amenities)
                 .order(:name)

    serialized_workspaces = workspaces.map { |workspace| serialized_workspace(workspace) }

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
    reservations = @workspace.reservations
                             .includes(:user)
                             .order(start_time: :desc)
                             .limit(10)

    serialized_reservations = reservations.as_json(
      only: [ :id, :start_time, :end_time, :status ],
      include: {
        user: { only: [ :id, :name, :email ] }
      }
    )

    respond_to do |format|
      format.html do
        render inertia: "workspaces/show", props: {
          workspace: serialized_workspace(@workspace),
          reservations: serialized_reservations,
          reservation_count: @workspace.reservations.count
        }
      end

      format.json do
        render json: {
          workspace: serialized_workspace(@workspace),
          reservations: serialized_reservations,
          reservation_count: @workspace.reservations.count
        }
      end
    end
  end

  def new
    render inertia: "workspaces/new", props: {
      amenities: Amenity.order(:name)
    }
  end

  def create
    workspace = current_organization.workspaces.build(workspace_params)

    respond_to do |format|
      if workspace.save
        format.html do
          redirect_to workspaces_path, notice: "Workspace created successfully"
        end

        format.json do
          render json: serialized_workspace(workspace), status: :created
        end
      else
        format.html do
          render inertia: "workspaces/new",
                 props: {
                   amenities: Amenity.order(:name),
                   errors: workspace.errors.to_hash
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: { errors: workspace.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def edit
    render inertia: "workspaces/edit", props: {
      workspace: serialized_workspace(@workspace),
      amenities: Amenity.order(:name),
      selected_amenity_ids: @workspace.amenity_ids
    }
  end

  def update
    respond_to do |format|
      if @workspace.update(workspace_params)
        format.html do
          redirect_to workspaces_path, notice: "Workspace updated successfully"
        end

        format.json do
          render json: serialized_workspace(@workspace)
        end
      else
        format.html do
          render inertia: "workspaces/edit",
                 props: {
                   workspace: serialized_workspace(@workspace),
                   amenities: Amenity.order(:name),
                   selected_amenity_ids: @workspace.amenity_ids,
                   errors: @workspace.errors.to_hash
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: { errors: @workspace.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def delete_confirmation
    reservation_count = @workspace.reservations.count
    can_delete = reservation_count.zero?

    render inertia: "workspaces/delete", props: {
      workspace: serialized_workspace(@workspace),
      reservation_count: reservation_count,
      can_delete: can_delete,
      delete_error: can_delete ? nil : "This workspace has reservation history. Mark it as inactive instead of deleting it."
    }
  end

  def destroy
    if @workspace.reservations.exists?
      respond_to do |format|
        format.html do
          render inertia: "workspaces/delete",
                 props: {
                   workspace: serialized_workspace(@workspace),
                   reservation_count: @workspace.reservations.count,
                   can_delete: false,
                   delete_error: "This workspace has reservation history. Mark it as inactive instead of deleting it."
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: { errors: [ "Workspace has reservation history" ] },
                 status: :unprocessable_entity
        end
      end

      return
    end

    @workspace.destroy

    respond_to do |format|
      format.html do
        redirect_to workspaces_path, notice: "Workspace deleted successfully"
      end

      format.json do
        render json: { message: "Workspace deleted successfully" }
      end
    end
  end

  private

  def set_workspace
    @workspace = current_organization
                 .workspaces
                 .with_attached_photo
                 .includes(:amenities)
                 .find(params[:id])
  end

  def workspace_params
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

  def serialized_workspace(workspace)
    workspace.as_json(
      only: [
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
      ],
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
      photo_url: workspace_photo_url(workspace),
      photo_filename: workspace_photo_filename(workspace)
    )
  end

  def workspace_photo_url(workspace)
    return nil unless workspace.photo.attached?

    url_for(workspace.photo)
  end

  def workspace_photo_filename(workspace)
    return nil unless workspace.photo.attached?

    workspace.photo.filename.to_s
  end
end
