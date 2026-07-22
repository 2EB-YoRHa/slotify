class OrganizationsController < InertiaController
  before_action :require_manager_or_admin!, only: %i[edit update]

def show
  organization = current_organization

  users = organization.users
                      .includes(:role)
                      .order(:name)

  invitations = organization.organization_invitations
                            .includes(:role, :invited_by)
                            .order(created_at: :desc)

  subscription = organization.subscriptions
                             .order(created_at: :desc)
                             .first

  roles = Role.where(name: [ "member", "manager" ]).order(:name)

  respond_to do |format|
    format.html do
      render inertia: "organizations/show", props: {
        organization: organization.as_json(
          only: [ :id, :name, :slug, :email, :phone, :address ]
        ),
        users: users.as_json(
          only: [ :id, :name, :email, :active ],
          include: {
            role: { only: [ :id, :name ] }
          }
        ),
        invitations: invitations.as_json(
          only: [ :id, :email, :status, :token, :expires_at, :created_at ],
          include: {
            role: { only: [ :id, :name ] },
            invited_by: { only: [ :id, :name, :email ] }
          }
        ),
        roles: roles.as_json(only: [ :id, :name ]),
        booking_rule: organization.booking_rule,
        subscription: subscription
      }
    end

    format.json do
      render json: {
        organization: organization.as_json(
          only: [ :id, :name, :slug, :email, :phone, :address ]
        ),
        users: users.as_json(
          only: [ :id, :name, :email, :active ],
          include: {
            role: { only: [ :id, :name ] }
          }
        ),
        invitations: invitations.as_json(
          only: [ :id, :email, :status, :token, :expires_at, :created_at ],
          include: {
            role: { only: [ :id, :name ] },
            invited_by: { only: [ :id, :name, :email ] }
          }
        ),
        roles: roles.as_json(only: [ :id, :name ]),
        booking_rule: organization.booking_rule,
        subscription: subscription
      }
    end
  end
end

  def edit
    render inertia: "organizations/edit", props: {
      organization: current_organization.as_json(
        only: [ :id, :name, :slug, :email, :phone, :address ]
      )
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
                   organization: organization.as_json(
                     only: [ :id, :name, :slug, :email, :phone, :address ]
                   ),
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
