export type AdvancedSearch = {
    ciudad: string;
    descripcion: string;
    cantPersonas: number;
    cantCamas: number;
    cantBanios: number;
    cantHabitaciones: number;
    tieneWifi: number;
    cantVehiculosParqueo: number;
    precioNoche: number;
}

export type PlaceResponse = {
    id: number;
    nombre: string;
    descripcion: string;
    cantPersonas: number;
    cantCamas: number;
    cantBanios: number;
    cantHabitaciones: number;
    tieneWifi: number;
    cantVehiculosParqueo: number;
    precioNoche: number;
    costoLimpieza: number;
    ciudad: string;
    latitud: number;
    longitud: number;
    arrendatario_id: number;
    created_at: string;
    updated_at: string;
    arrendatario: Arrendatario;
    fotos: Foto[];
}

export type Foto = {
    id: number;
    url: string;
    lugar_id: number;
    created_at: string;
    updated_at: string;
}

export type Arrendatario = {
    id: number;
    nombrecompleto: string;
    email: string;
    telefono: string;
    email_verified_at: string | null;
    password: string;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
}

export type Reserva = {
    lugar_id: number;
    cliente_id: number;
    fechaInicio: string;
    fechaFin: string;
    precioTotal: number;
    precioLimpieza: number;
    precioNoches: number;
    precioServicio: number;
}