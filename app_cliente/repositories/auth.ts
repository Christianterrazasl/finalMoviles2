import api from "./api"

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/cliente/login', { email, password });
    return data;
};

    export const register = async (nombrecompleto: string, email: string, password: string, telefono: string) =>{
    const { data } = await api.post('/api/cliente/registro', { nombrecompleto, email, password, telefono });
    return data;
}