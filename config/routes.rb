Rails.application.routes.draw do
  devise_for :users

  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end

  root "dashboard#index"

  resource :organization, only: [:show, :edit, :update]

  resources :workspaces
  resources :reservations

  resources :amenities, only: [:index, :create, :destroy]
  resource :booking_rule, only: [:show, :edit, :update]

  get "up" => "rails/health#show", as: :rails_health_check
end