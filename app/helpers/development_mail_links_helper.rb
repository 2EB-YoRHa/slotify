module DevelopmentMailLinksHelper
  private

  def development_manual_email_links_for(user, confirmation: false, reset_password: false)
    return {} unless Rails.env.development?
    return {} if user.blank?

    links = {}

    if confirmation
      confirmation_url = development_confirmation_url_for(user)
      links[:confirmation_url] = confirmation_url if confirmation_url.present?
    end

    if reset_password
      reset_password_url = development_reset_password_url_for(user)
      links[:reset_password_url] = reset_password_url if reset_password_url.present?
    end

    links
  end

  def store_development_manual_email_links(links)
    return unless Rails.env.development?
    return if links.blank?

    session[:development_manual_links] = {
      confirmation_url: links[:confirmation_url] || links["confirmation_url"],
      reset_password_url: links[:reset_password_url] || links["reset_password_url"]
    }.compact
  end

  def pull_development_manual_email_links
    return {} unless Rails.env.development?

    links = session.delete(:development_manual_links) || {}

    {
      confirmation_url: links[:confirmation_url] || links["confirmation_url"],
      reset_password_url: links[:reset_password_url] || links["reset_password_url"]
    }.compact
  end

  def development_confirmation_url_for(user)
    return nil unless user.respond_to?(:confirmed?)
    return nil if user.confirmed?

    raw_token = user.instance_variable_get(:@raw_confirmation_token)
    raw_token ||= (session[:development_confirmation_tokens] || {})[user.email]

    if raw_token.blank?
      raw_token, encrypted_token = Devise.token_generator.generate(
        User,
        :confirmation_token
      )

      user.update_columns(
        confirmation_token: encrypted_token,
        confirmation_sent_at: Time.current
      )
    end

    remember_development_confirmation_token(user, raw_token)

    user_confirmation_url(confirmation_token: raw_token)
  end

  def development_reset_password_url_for(user)
    return nil unless user.respond_to?(:reset_password_token)

    raw_token = user.instance_variable_get(:@raw_reset_password_token)
    raw_token ||= (session[:development_reset_password_tokens] || {})[user.email]

    if raw_token.blank?
      raw_token, encrypted_token = Devise.token_generator.generate(
        User,
        :reset_password_token
      )

      user.update_columns(
        reset_password_token: encrypted_token,
        reset_password_sent_at: Time.current
      )
    end

    remember_development_reset_password_token(user, raw_token)

    edit_user_password_url(reset_password_token: raw_token)
  end

  def remember_development_confirmation_token(user, raw_token)
    session[:development_confirmation_tokens] ||= {}
    session[:development_confirmation_tokens][user.email] = raw_token
  end

  def remember_development_reset_password_token(user, raw_token)
    session[:development_reset_password_tokens] ||= {}
    session[:development_reset_password_tokens][user.email] = raw_token
  end
end
