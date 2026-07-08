class Reservation < ApplicationRecord
  belongs_to :organization
  belongs_to :user
  belongs_to :workspace

  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, presence: true
  validates :attendees_count, numericality: { greater_than: 0 }

  validate :end_time_after_start_time
  validate :workspace_available

  private

  def end_time_after_start_time
    return if start_time.blank? || end_time.blank?

    errors.add(:end_time, "must be after start time") if end_time <= start_time
  end

  def workspace_available
    return if workspace.blank? || start_time.blank? || end_time.blank?

    overlapping = Reservation
      .where(workspace_id: workspace_id)
      .where.not(id: id)
      .where.not(status: "cancelled")
      .where("start_time < ? AND end_time > ?", end_time, start_time)

    errors.add(:base, "Workspace is already reserved for this time") if overlapping.exists?
  end
end
