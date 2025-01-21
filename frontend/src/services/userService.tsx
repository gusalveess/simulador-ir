import { api } from "./api";

export const getUserInfo = async (userId: string) => {
  try {
    let url = `/users/${userId}`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar informações:", error);
    throw error;
  }
};

export const enableTwoFactorAuth = async (userId: string) => {
  try {
    let url = `/auth/enable-2fa/${userId}`;
    const response = await api.post(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao habilitar 2FA:", error);
    throw error;
  }
};

export const disableTwoFactorAuth = async (userId: string) => {
  try {
    let url = `/auth/disable-2fa/${userId}`;
    const response = await api.post(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao habilitar 2FA:", error);
    throw error;
  }
};