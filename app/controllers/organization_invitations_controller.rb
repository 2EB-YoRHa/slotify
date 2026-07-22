class OrganizationInvitationsController < InertiaController
  before_action :require_manager_or_admin!
  before_action :set_invitation, only: [ :destroy ]

  def create
    invitation = current_organization.organization_invitations.build(
      invitation_params.merge(invited_by: current_user)
    )

    respond_to do |format|
      if invitation.save
        format.html do
          redirect_to organization_path,
                      notice: "Invitation created successfully"
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
          render json: { errors: invitation.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def destroy
    @invitation.destroy

    respond_to do |format|
      format.html do
        redirect_to organization_path,
                    notice: "Invitation deleted successfully"
      end

      format.json do
        render json: { message: "Invitation deleted successfully" }
      end
    end
  end

  private

  def set_invitation
    @invitation = current_organization.organization_invitations.find(params[:id])
  end

  def invitation_params
    params.require(:organization_invitation).permit(:email, :role_id)
  end
end
