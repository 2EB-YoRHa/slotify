class WorkspacesController < InertiaController
  before_action :require_manager_or_admin!, except: %i[index show]
  before_action :set_workspace, only: %i[show edit update destroy]

  def index
    workspaces = current_organization.workspaces.includes(:amenities)
    serialized_workspaces = workspaces.as_json(include: :amenities)

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
    serialized_workspace = @workspace.as_json(
      include: [:amenities, :reservations]
    )

    respond_to do |format|
      format.html do
        render inertia: "workspaces/show", props: {
          workspace: serialized_workspace
        }
      end

      format.json do
        render json: serialized_workspace
      end
    end
  end

  def new
    render inertia: "workspaces/new", props: {
      amenities: Amenity.all
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
          render json: workspace.as_json(include: :amenities), status: :created
        end
      else
        format.html do
          render inertia: "workspaces/new",
                 props: {
                   amenities: Amenity.all,
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
      workspace: @workspace.as_json(include: :amenities),
      amenities: Amenity.all
    }
  end

  def update
    respond_to do |format|
      if @workspace.update(workspace_params)
        format.html do
          redirect_to workspaces_path, notice: "Workspace updated successfully"
        end

        format.json do
          render json: @workspace.as_json(include: :amenities)
        end
      else
        format.html do
          render inertia: "workspaces/edit",
                 props: {
                   workspace: @workspace.as_json(include: :amenities),
                   amenities: Amenity.all,
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

  def destroy
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
    @workspace = current_organization.workspaces.find(params[:id])
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
      amenity_ids: []
    )
  end
end