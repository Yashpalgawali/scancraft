import { apiClient } from "./apiClient";

export const readCode = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // Do NOT manually set Content-Type here.
    // axios will automatically set multipart/form-data with the correct boundary
    // when it detects a FormData body.
    return apiClient.post("/decode/", formData);
};
