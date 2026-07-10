class AmenitiesController < InertiaController
  before_action :require_manager_or_admin!, except: %i[index]
  before_action :set_amenity, only: %i[destroy]

  def index
    amenities = Amenity.order(:name)

    respond_to do |format|
      format.html do
        render inertia: "amenities/index", props: {
          amenities: amenities
        }
      end

      format.json do
        render json: amenities
      end
    end
  end

  def create
    amenity = Amenity.new(amenity_params)

    respond_to do |format|
      if amenity.save
        format.html do
          redirect_to amenities_path,
                      notice: "Amenity created successfully"
        end

        format.json do
          render json: amenity, status: :created
        end
      else
        format.html do
          render inertia: "amenities/index",
                 props: {
                   amenities: Amenity.order(:name),
                   errors: amenity.errors.to_hash
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: { errors: amenity.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def destroy
    @amenity.destroy

    respond_to do |format|
      format.html do
        redirect_to amenities_path,
                    notice: "Amenity deleted successfully"
      end

      format.json do
        render json: { message: "Amenity deleted successfully" }
      end
    end
  end

  private

  def set_amenity
    @amenity = Amenity.find(params[:id])
  end

  def amenity_params
    params.require(:amenity).permit(:name)
  end
end