import { api } from "./api";

export const getDeclarations = async (userId: string, year?: string, date?: string) => {
  try {
    let url = `/declaracoes/${userId}`;
    const params: Record<string, string> = {};
    
    if (year) params["year"] = year;
    if (date) params["date"] = date;

    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar declarações:", error);
    throw error;
  }
};

export const createDeclaration = async (userId: string, data: any) => {
  return api.post(`/declaracoes/${userId}`, data);
}

export const getDeclarationsSpecific = async (userId: string, declarationId: string) => {
  try {
    let url = `/declaracoes/${userId}/${declarationId}`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar a declaração:", error);
    throw error;
  }
};

export const updateDeclaration = async (userId: string, declarationId: string, data: any) => {
  return api.patch(`/declaracoes/${userId}/${declarationId}`, data);
};

export const sendDeclaration = async (userId: string, declarationId: string, data: any) => {
  return api.patch(`/declaracoes/send/${userId}/${declarationId}`, data);
};

export const deleteDeclaration = async (userId: string, declarationId: string) => {
  return api.delete(`/declaracoes/${userId}/${declarationId}`);
};