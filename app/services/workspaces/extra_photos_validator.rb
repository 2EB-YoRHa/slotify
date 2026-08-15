module Workspaces
  class ExtraPhotosValidator
    def initialize(organization:, workspace:, files:)
      @organization = organization
      @workspace = workspace
      @files = Array(files)
    end

    def error_message
      return nil if files.blank?

      return pro_plan_required_message unless organization.multiple_workspace_photos_enabled?
      return limit_message if next_photo_count > Workspace::MAX_EXTRA_PHOTOS
      return content_type_message if invalid_file.present?
      return size_message if oversized_file.present?

      nil
    end

    private

      attr_reader :organization, :workspace, :files

      def next_photo_count
        current_photo_count + files.size
      end

      def current_photo_count
        return 0 unless workspace.persisted?

        workspace.extra_photos.attachments.size
      end

      def invalid_file
        files.find do |file|
          !file.content_type.in?(Workspace::ALLOWED_PHOTO_CONTENT_TYPES)
        end
      end

      def oversized_file
        files.find do |file|
          file.size > Workspace::MAX_PHOTO_SIZE
        end
      end

      def pro_plan_required_message
        "Extra gallery photos are only available on the Pro plan."
      end

      def limit_message
        "You can attach up to #{Workspace::MAX_EXTRA_PHOTOS} extra gallery photos."
      end

      def content_type_message
        "Extra gallery photos must be PNG, JPG, JPEG, or WEBP images."
      end

      def size_message
        "Each extra gallery photo must be less than 5MB."
      end
  end
end
