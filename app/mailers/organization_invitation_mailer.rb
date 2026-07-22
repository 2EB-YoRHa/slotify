class OrganizationInvitationMailer < ApplicationMailer
  def invitation_email(invitation)
    @invitation = invitation
    @organization = invitation.organization
    @invited_by = invitation.invited_by
    @role = invitation.role

    @accept_url = accept_organization_invitations_url(token: invitation.token)

    mail(
      from: ENV.fetch("SENDGRID_FROM_EMAIL"),
      to: invitation.email,
      subject: "You have been invited to join #{@organization.name} on Slotify"
    )
  end
end
