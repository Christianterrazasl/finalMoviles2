import api from "./api"

export const login = async (email: string, password: string) => {
    const response = await api.post('/api/cliente/login', { email, password });
    return response;
};

    export const register = async (nombrecompleto: string, email: string, password: string, telefono: string) =>{
    const response = await api.post('/api/cliente/registro', { nombrecompleto, email, password, telefono });
    return response;
}