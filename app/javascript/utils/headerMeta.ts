import type { HeaderMeta } from "../types/layout";

export function headerMetaFor(
  url: string,
  role?: string | null,
): HeaderMeta {
  const path = url.split("?")[0];

  if (path === "/") {
    return role === "member"
      ? {
          title: "Dashboard",
          description: "Find workspaces, review bookings, and manage your day.",
        }
      : {
          title: "Dashboard",
          description: "Track reservations, workspace activity, and team usage.",
        };
  }

  if (path.startsWith("/reservations/new")) {
    return {
      title: "Create Reservation",
      description: "Choose a workspace, select a time, and confirm the booking.",
    };
  }

  if (path.startsWith("/reservations")) {
    return {
      title: "Reservations",
      description: "Review, manage, and update workspace bookings.",
    };
  }

  if (path.startsWith("/my_reservations")) {
    return {
      title: "My Bookings",
      description: "View your upcoming and previous reservations.",
    };
  }

  if (path.startsWith("/workspaces")) {
    return {
      title: "Workspaces",
      description: "Manage workspace inventory, details, capacity, and photos.",
    };
  }

  if (path.startsWith("/amenities")) {
    return {
      title: "Amenities",
      description: "Create and manage reusable workspace features.",
    };
  }

  if (path.startsWith("/organization")) {
    return {
      title: "Organization",
      description: "Manage organization details, members, and invitations.",
    };
  }

  if (path.startsWith("/subscription")) {
    return {
      title: "Subscription",
      description: "Review plan limits, billing status, and available upgrades.",
    };
  }

  if (path.startsWith("/booking_rule")) {
    return {
      title: "Booking Rules",
      description: "Control booking limits, availability, and reservation policy.",
    };
  }

  if (path.startsWith("/booking_time_slots")) {
    return {
      title: "Time Slots",
      description: "Manage custom booking schedules for Pro organizations.",
    };
  }

  if (path.startsWith("/profile")) {
    return {
      title: "Profile",
      description: "Update your photo, name, email, and account identity.",
    };
  }

  if (path.startsWith("/security")) {
    return {
      title: "Security",
      description: "Manage password and two-factor authentication.",
    };
  }

  return {
    title: "Slotify",
    description: "Workspace reservation management.",
  };
}