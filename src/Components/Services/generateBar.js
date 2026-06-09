import { apiClient } from "./apiClient";

export const createBarCode = async (data) => apiClient.post(`/generate/barcode?message=${encodeURIComponent(data)}`, {}, { responseType: 'blob' });
