class WorkspacesController < InertiaController
  before_action :require_manager_or_admin!, except: %i[index show]
  before_action :ensure_workspace_slot_available!, only: %i[new create]
  before_action :set_workspace, only: %i[show edit update destroy delete_confirmation]

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
    reservations = @workspace.reservations
                             .includes(:user)
                             .order(start_time: :desc)
                             .limit(10)

    serialized_reservations = reservations.as_json(
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

    respond_to do |format|
      format.html do
        render inertia: "workspaces/show", props: {
          workspace: serialize_workspace(@workspace),
          reservations: serialized_reservations,
          reservation_count: @workspace.reservations.count
        }
      end

      format.json do
        render json: {
          workspace: serialize_workspace(@workspace),
          reservations: serialized_reservations,
          reservation_count: @workspace.reservations.count
        }
      end
    end
  end

  def new
    render inertia: "workspaces/new", props: {
      amenities: amenities_for_form
    }
  end

  def create
    workspace = current_organization.workspaces.build(workspace_params)

    respond_to do |format|
      if workspace.save
        format.html do
          redirect_to workspaces_path,
                      notice: "Workspace created successfully"
        end

        format.json do
          render json: serialize_workspace(workspace),
                 status: :created
        end
      else
        format.html do
          render inertia: "workspaces/new",
                 props: {
                   amenities: amenities_for_form,
                   errors: workspace.errors.to_hash
                 },
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
    render inertia: "workspaces/edit", props: {
      workspace: serialize_workspace(@workspace),
      amenities: amenities_for_form,
      selected_amenity_ids: @workspace.amenity_ids
    }
  end

  def update
    respond_to do |format|
      if @workspace.update(workspace_params)
        format.html do
          redirect_to workspaces_path,
                      notice: "Workspace updated successfully"
        end

        format.json do
          render json: serialize_workspace(@workspace)
        end
      else
        format.html do
          render inertia: "workspaces/edit",
                 props: {
                   workspace: serialize_workspace(@workspace),
                   amenities: amenities_for_form,
                   selected_amenity_ids: @workspace.amenity_ids,
                   errors: @workspace.errors.to_hash
                 },
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

  def ensure_workspace_slot_available!
    return unless current_organization.workspace_limit_reached?

    message = workspace_limit_message

    respond_to do |format|
      format.html do
        if action_name == "create"
          render inertia: "workspaces/new",
                 props: {
                   amenities: amenities_for_form,
                   errors: {
                     base: [
                       message
                     ]
                   }
                 },
                 status: :unprocessable_entity
        else
          redirect_to subscription_path, alert: message
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

  def workspace_limit_message
    if current_organization.billing_required?
      "Choose a subscription plan before creating workspaces."
    elsif current_organization.workspace_over_limit?
      "This organization is over the current workspace limit. Upgrade to Pro or reduce usage before creating more workspaces."
    else
      "Your current plan has reached the workspace limit. Upgrade to Pro to add more workspaces."
    end
  end

  def workspace_scope
    current_organization
      .workspaces
      .with_attached_photo
      .includes(:amenities)
  end

  def set_workspace
    @workspace = workspace_scope.find(params[:id])
  end

  def amenities_for_form
    Amenity.order(:name)
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
