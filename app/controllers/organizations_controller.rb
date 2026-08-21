class OrganizationsController < InertiaController
  before_action :require_manager_or_admin!

  def show
    organization = current_organization

    users = organization.users
                        .includes(:role, avatar_attachment: :blob)
                        .order(:name)

    invitations = organization.organization_invitations
                              .where(status: "pending")
                              .includes(:role, :invited_by)
                              .order(created_at: :desc)

    subscription = organization.subscriptions
                               .order(created_at: :desc)
                               .first

    roles = Role.where(name: [ "member", "manager" ]).order(:name)

    props = {
      organization: organization.as_json(
        only: [ :id, :name, :slug, :email, :phone, :address ]
      ),
      users: serialize_users(users),
      invitations: invitations.as_json(
        only: [ :id, :email, :status, :token, :expires_at, :created_at ],
        include: {
          role: { only: [ :id, :name ] },
          invited_by: { only: [ :id, :name, :email ] }
        }
      ),
      roles: roles.as_json(only: [ :id, :name ]),
      booking_rule: organization.booking_rule,
      subscription: subscription,
      current_user_role: current_user.role&.name,
      current_user_email: current_user.email,
      can_manage_organization: admin? || manager?
    }

    respond_to do |format|
      format.html do
        render inertia: "organizations/show", props: props
      end

      format.json do
        render json: props
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

  def serialize_users(users)
    users.map do |user|
      user.as_json(
        only: [ :id, :name, :email, :active ],
        include: {
          role: { only: [ :id, :name ] }
        }
      ).merge(
        avatar_url: user.avatar.attached? ? url_for(user.avatar) : nil
      )
    end
  end
end
