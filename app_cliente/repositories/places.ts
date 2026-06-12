import api from "./api";
import type { AdvancedSearch } from "../types/types";

export const searchPlaces = async (search: string) => {
    const { data } = await api.post(`/api/lugares/search`, { search });
    return data;
}

export const advancedSearchPlaces = async (advancedSearch: AdvancedSearch) => {
    const { data } = await api.post(`/api/lugares/advancedsearch`, advancedSearch);
    return data;
}