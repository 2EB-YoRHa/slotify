class ProfilesController < ApplicationController
  def show
    render inertia: "profile/show", props: {
      profile: serialize_profile(current_user),
      errors: {}
    }
  end

  def update
    if password_change_requested? || email_change_requested?
      unless current_user.valid_password?(profile_params[:current_password].to_s)
        render_profile_error(current_password: "Current password is incorrect.")
        return
      end
    end

    current_user.assign_attributes(profile_attributes)
    current_user.avatar.purge if remove_avatar_requested? && profile_params[:avatar].blank?
    current_user.avatar.attach(profile_params[:avatar]) if profile_params[:avatar].present?

    if current_user.save
      bypass_sign_in(current_user) if password_change_requested?

      notice =
          if email_change_requested?
            "Profile updated. Please check your new email to confirm the address change."
          else
            "Profile updated successfully."
          end

        redirect_to profile_path, notice: notice
    else
      render_profile_error(current_user.errors.to_hash)
    end
  end

  private

  def profile_params
    params.require(:user).permit(
      :name,
      :email,
      :avatar,
      :remove_avatar,
      :current_password,
      :password,
      :password_confirmation
    )
  end

  def profile_attributes
    attributes = {
      name: profile_params[:name],
      email: profile_params[:email].to_s.strip.downcase
    }

    if password_change_requested?
      attributes[:password] = profile_params[:password]
      attributes[:password_confirmation] = profile_params[:password_confirmation]
    end

    attributes
  end

  def password_change_requested?
    profile_params[:password].present? || profile_params[:password_confirmation].present?
  end

  def email_change_requested?
    profile_params[:email].to_s.strip.downcase != current_user.email
  end

  def remove_avatar_requested?
    ActiveModel::Type::Boolean.new.cast(profile_params[:remove_avatar])
  end

  def render_profile_error(errors)
    render inertia: "profile/show",
           props: {
             profile: serialize_profile(current_user),
             errors: errors
           },
           status: :unprocessable_entity
  end

  def serialize_profile(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      confirmed: user.confirmed?,
      confirmed_at: user.confirmed_at,
      pending_email: user.pending_reconfirmation? ? user.unconfirmed_email : nil,
      role: user.role&.name,
      active: user.active?,
      avatar_url: user.avatar.attached? ? url_for(user.avatar) : nil,
      organization: user.organization&.as_json(
        only: [ :id, :name, :slug, :email, :phone, :address ]
      ),
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  end
end
