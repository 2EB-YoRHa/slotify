class OrganizationsController < InertiaController
  before_action :require_manager_or_admin!, only: %i[edit update]

  def show
    organization = current_organization

    organization_data = organization.as_json(
      include: {
        users: {
          only: [:id, :name, :email, :active, :role_id]
        },
        booking_rule: {},
        subscriptions: {}
      }
    )

    respond_to do |format|
      format.html do
        render inertia: "organizations/show", props: {
          organization: organization_data
        }
      end

      format.json do
        render json: organization_data
      end
    end
  end

  def edit
    render inertia: "organizations/edit", props: {
      organization: current_organization
    }
  end

  def update
    organization = current_organization

    respond_to do |format|
      if organization.update(organization_params)
        format.html do
          redirect_to organization_path,
                      notice: "Organization updated successfully"
        end

        format.json do
          render json: organization
        end
      else
        format.html do
          render inertia: "organizations/edit",
                 props: {
                   organization: organization,
                   errors: organization.errors.to_hash
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: { errors: organization.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  private

  def organization_params
    params.require(:organization).permit(
      :name,
      :slug,
      :email,
      :phone,
      :address
    )
  end
end