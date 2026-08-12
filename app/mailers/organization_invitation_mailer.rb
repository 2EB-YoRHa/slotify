class OrganizationInvitationMailer < ApplicationMailer
  def invitation_email(invitation)
    @invitation = invitation
    @organization = invitation.organization
    @invited_by = invitation.invited_by
    @role = invitation.role
    @accept_url = accept_organization_invitations_url(token: invitation.token)

    mail(
      from: ENV.fetch("SENDGRID_FROM_EMAIL"),
      reply_to: ENV.fetch("SENDGRID_FROM_EMAIL"),
      to: invitation.email,
      subject: "#{@invited_by.name} invited you to join #{@organization.name} on Slotify"
    )
  end
end
