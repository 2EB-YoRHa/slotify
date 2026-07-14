class AmenitiesController < InertiaController
  before_action :require_manager_or_admin!

  def index
    amenities = Amenity.order(:name)

    render inertia: "amenities/index", props: {
      amenities: amenities
    }
  end

  def create
    amenity = Amenity.new(amenity_params)

    if amenity.save
      redirect_to amenities_path, notice: "Amenity created successfully"
    else
      render inertia: "amenities/index",
             props: {
               amenities: Amenity.order(:name),
               errors: amenity.errors.to_hash
             },
             status: :unprocessable_entity
    end
  end

  def destroy
    amenity = Amenity.find(params[:id])
    amenity.destroy

    redirect_to amenities_path, notice: "Amenity deleted successfully"
  end

  private

  def amenity_params
    params.require(:amenity).permit(:name)
  end
end