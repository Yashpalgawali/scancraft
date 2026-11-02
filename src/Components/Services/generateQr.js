import { apiClient } from "./apiClient";

export const createQrCode = async (data) => apiClient.post(`/generate/qr?message=${encodeURIComponent(data)}`, {}, { responseType: 'blob' });

export const hello = async () => apiClient.get(`/generate/hello`);