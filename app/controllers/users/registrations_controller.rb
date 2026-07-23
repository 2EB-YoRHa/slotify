class Users::RegistrationsController < Devise::RegistrationsController
  def new
    invitation = invitation_from_token(
      params[:invitation_token] || session[:pending_invitation_token]
    )

    render inertia: "auth/sign_up", props: {
      invitation: invitation.present? ? serialized_invitation(invitation) : nil,
      invitation_token: invitation&.token,
      errors: {}
    }
  end

  def create
    invitation_token = sign_up_params[:invitation_token]

    if invitation_token.present?
      create_from_invitation
    else
      create_manager_account
    end
  end

  private

  def create_from_invitation
    invitation = invitation_from_token(sign_up_params[:invitation_token])

    unless invitation
      render_sign_up(
        invitation: nil,
        invitation_token: sign_up_params[:invitation_token],
        errors: { invitation_token: "A valid invitation is required." },
        status: :unprocessable_entity
      )
      return
    end

    if invitation.email.downcase != sign_up_params[:email].to_s.downcase
      render_sign_up(
        invitation: invitation,
        invitation_token: invitation.token,
        errors: { email: "Email must match the invited email address." },
        status: :unprocessable_entity
      )
      return
    end

    user = User.new(
      name: sign_up_params[:name],
      email: invitation.email,
      password: sign_up_params[:password],
      password_confirmation: sign_up_params[:password_confirmation],
      organization: invitation.organization,
      role: invitation.role,
      active: true
    )

    if user.valid?
      ActiveRecord::Base.transaction do
        user.save!

        invitation.update!(
          status: "accepted",
          accepted_at: Time.current
        )
      end

      session.delete(:pending_invitation_token)

      sign_in(:user, user)

      redirect_to root_path, notice: "Account created successfully"
    else
      render_sign_up(
        invitation: invitation,
        invitation_token: invitation.token,
        errors: user.errors.to_hash,
        status: :unprocessable_entity
      )
    end
  end

  def create_manager_account
    organization_name = sign_up_params[:organization_name].to_s.strip

    if organization_name.blank?
      render_sign_up(
        invitation: nil,
        invitation_token: nil,
        errors: { organization_name: "Organization name is required." },
        status: :unprocessable_entity
      )
      return
    end

    manager_role = Role.find_or_create_by!(name: "manager")

    organization = Organization.new(
      name: organization_name,
      slug: unique_organization_slug(organization_name),
      email: sign_up_params[:email]
    )

    user = User.new(
      name: sign_up_params[:name],
      email: sign_up_params[:email],
      password: sign_up_params[:password],
      password_confirmation: sign_up_params[:password_confirmation],
      organization: organization,
      role: manager_role,
      active: true
    )

    if organization.valid? && user.valid?
      ActiveRecord::Base.transaction do
        organization.save!
        user.save!
      end

      sign_in(:user, user)

      redirect_to root_path, notice: "Organization account created successfully"
    else
      errors = user.errors.to_hash

      if organization.errors[:name].present?
        errors[:organization_name] = organization.errors[:name]
      end

      if organization.errors[:slug].present?
        errors[:organization_name] = organization.errors[:slug]
      end

      render_sign_up(
        invitation: nil,
        invitation_token: nil,
        errors: errors,
        status: :unprocessable_entity
      )
    end
  end

  def sign_up_params
    params.require(:user).permit(
      :name,
      :email,
      :password,
      :password_confirmation,
      :invitation_token,
      :organization_name
    )
  end

  def invitation_from_token(token)
    return nil if token.blank?

    invitation = OrganizationInvitation
      .includes(:organization, :role, :invited_by)
      .find_by(token: token, status: "pending")

    return nil if invitation.blank?
    return nil if invitation.expires_at.present? && invitation.expires_at < Time.current

    invitation
  end

  def render_sign_up(invitation:, invitation_token:, errors:, status:)
    render inertia: "auth/sign_up", props: {
      invitation: invitation.present? ? serialized_invitation(invitation) : nil,
      invitation_token: invitation_token,
      errors: errors
    }, status: status
  end

  def serialized_invitation(invitation)
    invitation.as_json(
      only: [ :id, :email, :status, :token, :expires_at, :created_at ],
      include: {
        organization: { only: [ :id, :name, :slug, :email ] },
        role: { only: [ :id, :name ] },
        invited_by: { only: [ :id, :name, :email ] }
      }
    )
  end

  def unique_organization_slug(name)
    base_slug = name.to_s.parameterize
    base_slug = "organization" if base_slug.blank?

    slug = base_slug
    counter = 2

    while Organization.exists?(slug: slug)
      slug = "#{base_slug}-#{counter}"
      counter += 1
    end

    slug
  end
end
