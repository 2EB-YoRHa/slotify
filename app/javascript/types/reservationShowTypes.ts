import type { Reservation } from "../types/reservation";

export type ReservationShowCurrentUser = {
  id: number;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export type ReservationShowData = Reservation;

export type AmenityChipData = {
  id: number;
  name: string;
};