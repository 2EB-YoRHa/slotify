Rails.application.routes.draw do
  devise_for :users, controllers: {
  registrations: "users/registrations"
 }

  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end

  root "dashboard#index"

  resource :organization, only: [ :show, :edit, :update ]
  resource :booking_rule, only: [ :show, :edit, :update ]
  resource :subscription, only: [ :show ]

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
end
