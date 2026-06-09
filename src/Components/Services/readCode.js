import { apiClient } from "./apiClient";

export const readCode = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/decode/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};
