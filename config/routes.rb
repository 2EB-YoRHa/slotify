Rails.application.routes.draw do
    devise_for :users, controllers: {
        sessions: "users/sessions",
        registrations: "users/registrations",
        passwords: "users/passwords"
    }

  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end

  root "dashboard#index"

  resource :organization, only: [ :show, :edit, :update ]

  get "organization/members/:id",
    to: "organization_members#show",
    as: :organization_member

  patch "organization/members/:id/toggle_active",
    to: "organization_members#toggle_active",
    as: :toggle_active_organization_member

  resource :booking_rule, only: [ :show, :edit, :update ]

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
            get "accept/:token", to: "organization_invitations#accept", as: :accept
            patch "accept/:token", to: "organization_invitations#confirm_accept", as: :confirm_accept
        end
    end

    get "up" => "rails/health#show", as: :rails_health_check

    get "errors/403", to: "errors#forbidden"
    get "errors/404", to: "errors#not_found"
    get "errors/422", to: "errors#unprocessable"
    get "errors/500", to: "errors#internal_server_error"

    match "*unmatched",
        to: "errors#not_found",
        via: :all
end
