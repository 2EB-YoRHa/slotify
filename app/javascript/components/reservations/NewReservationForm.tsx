import { useForm } from "@inertiajs/react";
import { useState } from "react";
import ReservationWorkspaceCard from "./ReservationWorkspaceCard";
import type { Workspace } from "../../types/workspace";

type TimeSlot = {
  label: string;
  start: string;
  end: string;
};

type NewReservationFormProps = {
  workspaces: Workspace[];
  selectedWorkspaceId?: number | string | null;
  errors?: string[];
};

const timeSlots: TimeSlot[] = [
  { label: "09:00 AM - 10:00 AM", start: "09:00", end: "10:00" },
  { label: "10:00 AM - 11:00 AM", start: "10:00", end: "11:00" },
  { label: "11:00 AM - 12:00 PM", start: "11:00", end: "12:00" },
  { label: "10:00 AM - 12:00 PM", start: "10:00", end: "12:00" },
  { label: "01:00 PM - 02:00 PM", start: "13:00", end: "14:00" },
  { label: "02:00 PM - 04:00 PM", start: "14:00", end: "16:00" },
  { label: "04:00 PM - 05:00 PM", start: "16:00", end: "17:00" },
  { label: "05:00 PM - 06:00 PM", start: "17:00", end: "18:00" },
];

export default function NewReservationForm({
  workspaces,
  selectedWorkspaceId = null,
  errors = [],
}: NewReservationFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  const initialWorkspaceId = selectedWorkspaceId
    ? Number(selectedWorkspaceId)
    : "";

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>(timeSlots[0]);
  const [search, setSearch] = useState<string>("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [unavailableWorkspaceIds, setUnavailableWorkspaceIds] = useState<
    number[]
  >([]);
  const [availabilityChecked, setAvailabilityChecked] =
    useState<boolean>(false);
  const [checkingAvailability, setCheckingAvailability] =
    useState<boolean>(false);

  const { data, setData, post, processing, transform } = useForm({
    workspace_id: initialWorkspaceId,
    start_time: buildDateTime(today, timeSlots[0].start),
    end_time: buildDateTime(today, timeSlots[0].end),
    attendees_count: 1,
    notes: "",
  });

  const filteredWorkspaces = workspaces.filter((workspace) => {
    const query = search.toLowerCase();

    return (
      workspace.name?.toLowerCase().includes(query) ||
      workspace.location?.toLowerCase().includes(query) ||
      workspace.workspace_type?.toLowerCase().includes(query)
    );
  });

  function chooseDate(date: string) {
    setSelectedDate(date);
    setAvailabilityChecked(false);
    setUnavailableWorkspaceIds([]);

    setData({
      ...data,
      start_time: buildDateTime(date, selectedSlot.start),
      end_time: buildDateTime(date, selectedSlot.end),
    });
  }

  function chooseSlot(slot: TimeSlot) {
    setSelectedSlot(slot);
    setAvailabilityChecked(false);
    setUnavailableWorkspaceIds([]);

    setData({
      ...data,
      start_time: buildDateTime(selectedDate, slot.start),
      end_time: buildDateTime(selectedDate, slot.end),
    });
  }

  async function checkAvailability() {
    setCheckingAvailability(true);
    setClientError(null);

    const startTime = buildDateTime(selectedDate, selectedSlot.start);
    const endTime = buildDateTime(selectedDate, selectedSlot.end);

    try {
      const response = await fetch(
        `/reservations/availability?start_time=${encodeURIComponent(
          startTime
        )}&end_time=${encodeURIComponent(endTime)}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setClientError(result.error || "Could not check availability.");
        return;
      }

      setUnavailableWorkspaceIds(result.unavailable_workspace_ids || []);
      setAvailabilityChecked(true);
    } catch {
      setClientError("Could not check availability. Please try again.");
    } finally {
      setCheckingAvailability(false);
    }
  }

  function submitReservation(workspaceId: number) {
    const selectedWorkspaceId = Number(workspaceId);

    const selectedWorkspace = workspaces.find(
      (workspace) => Number(workspace.id) === selectedWorkspaceId
    );

    const attendeesCount = Number(data.attendees_count);

    if (!availabilityChecked) {
      setClientError("Please check availability before booking.");
      return;
    }

    if (unavailableWorkspaceIds.includes(selectedWorkspaceId)) {
      setClientError("This workspace is not available for the selected time.");
      return;
    }

    if (!attendeesCount || attendeesCount < 1) {
      setClientError("You must enter at least 1 attendee.");
      return;
    }

    if (selectedWorkspace && attendeesCount > Number(selectedWorkspace.capacity)) {
      setClientError(
        `This workspace only allows up to ${selectedWorkspace.capacity} people.`
      );
      return;
    }

    setClientError(null);

    transform((formData) => ({
      reservation: {
        ...formData,
        workspace_id: selectedWorkspaceId,
        attendees_count: attendeesCount,
        start_time: buildDateTime(selectedDate, selectedSlot.start),
        end_time: buildDateTime(selectedDate, selectedSlot.end),
      },
    }));

    post("/reservations");
  }

  return (
    <>
      {clientError && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">
          {clientError}
        </div>
      )}

      {errors.length > 0 && (
        <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <section className="space-y-8">
          <StepTitle number="1" title="Choose Date" />

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Reservation Date</h2>
              <span className="text-sm text-slate-400">Select a day</span>
            </div>

            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(event) => chooseDate(event.target.value)}
              className="input"
            />
          </div>

          <StepTitle number="2" title="Select Time Slot" />

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="mb-5 text-sm text-slate-500">Duration: Flexible</p>

            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => {
                const active = selectedSlot.label === slot.label;

                return (
                  <button
                    key={slot.label}
                    type="button"
                    onClick={() => chooseSlot(slot)}
                    className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                      active
                        ? "border-cyan-400 bg-cyan-400 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-cyan-100 bg-cyan-50 p-5">
            <div>
              <p className="text-sm font-bold text-slate-700">
                Selected Window
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {formatSelectedDate(selectedDate)} · {selectedSlot.label}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={checkAvailability}
                disabled={checkingAvailability}
                className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-60"
              >
                {checkingAvailability ? "Checking..." : "Check Availability"}
              </button>

              <button
                type="button"
                onClick={() => chooseSlot(timeSlots[0])}
                className="text-sm font-bold text-cyan-500"
              >
                Reset
              </button>
            </div>
          </div>

          <StepTitle number="3" title="Attendees" />

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-900">
              Number of Attendees
            </h2>

            <p className="mb-5 text-sm text-slate-500">
              Enter how many people will use the workspace. The system will
              validate this against the selected workspace capacity.
            </p>

            <input
              type="number"
              min="1"
              value={data.attendees_count}
              onChange={(event) =>
                setData("attendees_count", Number(event.target.value))
              }
              className="input"
            />

            <p className="mt-3 text-sm text-slate-400">
              You will not be able to book a workspace if the attendee count
              exceeds its capacity.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <StepTitle number="4" title="Available Spaces" />

            <p className="text-sm text-slate-500">
              {filteredWorkspaces.length} options found
            </p>
          </div>

          <div className="mb-5">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by room name or keyword..."
              className="input"
            />
          </div>

          {filteredWorkspaces.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              No active workspaces available.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorkspaces.map((workspace) => (
                <ReservationWorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  selected={Number(data.workspace_id) === Number(workspace.id)}
                  processing={processing}
                  attendeesCount={Number(data.attendees_count)}
                  unavailable={unavailableWorkspaceIds.includes(
                    Number(workspace.id)
                  )}
                  availabilityChecked={availabilityChecked}
                  onBook={() => submitReservation(workspace.id)}
                />
              ))}
            </div>
          )}

          <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50 p-5">
            <h3 className="font-bold text-orange-700">
              Planning a large event?
            </h3>

            <p className="mt-2 text-sm leading-6 text-orange-600">
              Our team can help organize larger sessions or special workspace
              needs.
            </p>

            <button
              type="button"
              className="mt-4 w-full rounded-lg bg-white px-4 py-3 text-sm font-bold text-orange-500"
            >
              Contact Events Team
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

type StepTitleProps = {
  number: string;
  title: string;
};

function StepTitle({ number, title }: StepTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-cyan-500">
        {number}
      </span>

      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function buildDateTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}

function formatSelectedDate(value: string): string {
  if (!value) return "-";

  return new Date(`${value}T00:00:00`).toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}