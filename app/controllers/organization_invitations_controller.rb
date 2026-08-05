class OrganizationInvitationsController < InertiaController
  skip_before_action :authenticate_user!, only: [ :accept ]
  before_action :require_manager_or_admin!, only: [ :create, :destroy ]
  before_action :ensure_member_slot_available!, only: [ :create ]
  before_action :set_invitation, only: [ :destroy ]
  before_action :set_invitation_by_token, only: [ :accept, :confirm_accept ]

  def create
    invitation = current_organization.organization_invitations.build(
      invitation_params.merge(invited_by: current_user)
    )

    respond_to do |format|
      if invitation.save
        OrganizationInvitationMailer
          .invitation_email(invitation)
          .deliver_now

        format.html do
          redirect_to organization_path,
                      notice: "Invitation sent successfully"
        end

        format.json do
          render json: invitation, status: :created
        end
      else
        format.html do
          redirect_to organization_path,
                      alert: invitation.errors.full_messages.to_sentence
        end

        format.json do
          render json: {
            errors: invitation.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end

  def accept
    if @invitation.status != "pending"
      redirect_to new_user_session_path,
                  alert: "This invitation has already been used"
      return
    end

    if @invitation.expires_at.present? && @invitation.expires_at < Time.current
      redirect_to new_user_session_path,
                  alert: "This invitation has expired"
      return
    end

    session[:pending_invitation_token] = @invitation.token

    render inertia: "organization_invitations/accept", props: {
      invitation: serialized_invitation(@invitation),
      current_user: user_signed_in? ? current_user.as_json(only: [ :id, :name, :email ]) : nil,
      authenticated: user_signed_in?,
      email_matches: user_signed_in? && current_user.email.downcase == @invitation.email.downcase
    }
  end

  def confirm_accept
    unless user_signed_in?
      redirect_to new_user_session_path,
                  alert: "You must sign in before accepting the invitation"
      return
    end

    if current_user.email.downcase != @invitation.email.downcase
      redirect_to accept_organization_invitations_path(token: @invitation.token),
                  alert: "This invitation belongs to another email address"
      return
    end

    if @invitation.status != "pending"
      redirect_to root_path,
                  alert: "This invitation has already been used"
      return
    end

    if @invitation.expires_at.present? && @invitation.expires_at < Time.current
      redirect_to root_path,
                  alert: "This invitation has expired"
      return
    end

    unless @invitation.organization.user_limit_available?(
      excluding_invitation: @invitation
    )
      redirect_to root_path,
                  alert: "This organization has reached its member limit."

      return
    end

    current_user.update!(
      organization: @invitation.organization,
      role: @invitation.role
    )

    @invitation.update!(
      status: "accepted",
      accepted_at: Time.current
    )

    redirect_to root_path,
                notice: "Invitation accepted successfully"
  end

  def destroy
    @invitation.destroy

    respond_to do |format|
      format.html do
        redirect_to organization_path,
                    notice: "Invitation deleted successfully"
      end

      format.json do
        render json: {
          message: "Invitation deleted successfully"
        }
      end
    end
  end

  private

  def ensure_member_slot_available!
    return unless current_organization.user_limit_reached?

    message = member_limit_message

    respond_to do |format|
      format.html do
        redirect_to organization_path, alert: message
      end

      format.json do
        render json: {
          error: message,
          code: "member_limit_reached"
        }, status: :unprocessable_entity
      end
    end
  end

  def member_limit_message
    if current_organization.billing_required?
      "Choose a subscription plan before inviting members."
    elsif current_organization.user_over_limit?
      "This organization is over the current member limit. Upgrade to Pro or reduce usage before inviting more members."
    else
      "Your current plan has reached the member limit. Upgrade to Pro to invite more members."
    end
  end

  def set_invitation
    @invitation = current_organization.organization_invitations.find(params[:id])
  end

  def set_invitation_by_token
    @invitation = OrganizationInvitation.find_by!(token: params[:token])
  end

  def invitation_params
    params.require(:organization_invitation).permit(:email, :role_id)
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
end
