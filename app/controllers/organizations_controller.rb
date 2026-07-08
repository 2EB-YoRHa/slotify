class OrganizationsController < InertiaController
  def show
    organization = current_user.organization

    render inertia: "organizations/show", props: {
      organization: organization
    }
  end

  def edit
    organization = current_user.organization

    render inertia: "organizations/edit", props: {
      organization: organization
    }
  end

  def update
    organization = current_user.organization

    if organization.update(organization_params)
      redirect_to organization_path, notice: "Organization updated successfully"
    else
      redirect_to edit_organization_path, inertia: { errors: organization.errors }
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