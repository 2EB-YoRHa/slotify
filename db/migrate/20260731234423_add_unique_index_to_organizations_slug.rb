class AddUniqueIndexToOrganizationsSlug < ActiveRecord::Migration[8.1]
  def up
    organization_class = Class.new(ApplicationRecord) do
      self.table_name = "organizations"
    end

    organization_class.reset_column_information

    organization_class.order(:id).find_each do |organization|
      base_slug = organization.slug.presence || organization.name.presence || "organization"
      base_slug = base_slug.to_s.parameterize.presence || "organization"

      slug = base_slug
      counter = 2

      while organization_class
              .where.not(id: organization.id)
              .where(slug: slug)
              .exists?
        slug = "#{base_slug}-#{counter}"
        counter += 1
      end

      organization.update_columns(
        slug: slug,
        updated_at: Time.current
      )
    end

    unless index_exists?(
      :organizations,
      :slug,
      name: "index_organizations_on_slug_unique"
    )
      add_index :organizations,
                :slug,
                unique: true,
                name: "index_organizations_on_slug_unique"
    end
  end

  def down
    remove_index :organizations,
                 name: "index_organizations_on_slug_unique",
                 if_exists: true
  end
end
