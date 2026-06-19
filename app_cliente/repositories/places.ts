import api from "./api";
import type { AdvancedSearch, Reserva } from "../types/types";

export const searchPlaces = async (search: string) => {
    const { data } = await api.post(`/api/lugares/search`, { search });
    return data;
}

export const advancedSearchPlaces = async (advancedSearch: AdvancedSearch) => {
    const { data } = await api.post(`/api/lugares/advancedsearch`, advancedSearch);
    return data;
}

export const getPlaceById = async (id: number) => {
    const { data } = await api.get(`/api/lugares/${id}`);
    return data;
}

