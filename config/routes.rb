Rails.application.routes.draw do
    devise_scope :user do
        get "auth/confirmation_required",
            to: "users/sessions#confirmation_required",
            as: :user_confirmation_required

        get "auth/inactive_account",
            to: "users/sessions#inactive_account",
            as: :user_inactive_account

        get "auth/two_factor",
            to: "users/two_factor_sessions#new",
            as: :user_two_factor_challenge

        post "auth/two_factor",
            to: "users/two_factor_sessions#create",
            as: :user_two_factor_verify
    end

  devise_for :users, controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations",
    passwords: "users/passwords",
    confirmations: "users/confirmations"
  }

  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end

  root "dashboard#index"

  resource :profile, only: [ :show, :update ]

  get "security", to: "two_factor_settings#show", as: :security

  resource :two_factor,
            only: [ :show, :destroy ],
            controller: "two_factor_settings" do
    post :prepare
    patch :enable
  end

  resource :password_settings, only: [ :update ]

  resource :organization, only: [ :show, :edit, :update ]

  get "organization/members/:id",
      to: "organization_members#show",
      as: :organization_member

  patch "organization/members/:id/toggle_active",
        to: "organization_members#toggle_active",
        as: :toggle_active_organization_member

  resource :booking_rule, only: [ :show, :edit, :update ]

  resources :booking_time_slots, except: [ :new, :edit ]

  resource :subscription, only: [ :show ] do
    post "checkout/:plan",
         to: "subscriptions#checkout",
         as: :checkout

    post "portal",
         to: "subscriptions#portal",
         as: :portal

    get "success",
        to: "subscriptions#success",
        as: :success

    get "cancel",
        to: "subscriptions#cancel",
        as: :cancel
  end

  post "stripe/webhooks",
       to: "stripe_webhooks#create"

  get "workspaces/:id/delete",
      to: "workspaces#delete_confirmation",
      as: :delete_workspace_confirmation

  resources :workspaces

  get "my_reservations",
      to: "reservations#my_reservations",
      as: :my_reservations

  get "reservations/availability",
      to: "reservations#availability"

  get "reservations/:id/cancel",
      to: "reservations#cancel_confirmation",
      as: :cancel_reservation_confirmation

  resources :reservations

  resources :amenities, only: [ :index, :create, :destroy ]

  resources :organization_invitations, only: [ :create, :destroy ] do
    collection do
      get "accept/:token",
          to: "organization_invitations#accept",
          as: :accept

      patch "accept/:token",
            to: "organization_invitations#confirm_accept",
            as: :confirm_accept
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check

  get "errors/403", to: "errors#forbidden"
  get "errors/404", to: "errors#not_found"
  get "errors/422", to: "errors#unprocessable"
  get "errors/500", to: "errors#internal_server_error"

  match "*unmatched",
        to: "errors#not_found",
        via: :all,
        constraints: lambda { |request|
          request.format.html? &&
            !request.path.start_with?("/rails/", "/assets/", "/vite/", "/favicon")
        }
end
