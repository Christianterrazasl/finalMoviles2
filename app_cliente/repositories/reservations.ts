import { Reserva, ReservaResponse } from "@/types/types";
import api from "./api";

export const makeReservation = async (reservation: Reserva) => {
    const { data } = await api.post(`/api/reservas`, reservation);
    return data;
}

export const getReservations = async (userId: number): Promise<ReservaResponse[]> => {
    const { data } = await api.get(`/api/reservas/cliente/${userId}`);
    return data;
}