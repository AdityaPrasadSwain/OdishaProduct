import API from "./api";

// Base path relative to API.baseURL (which is /api)
const BASE_PATH = "/products";

export const createProductStep1 = async (data) => {
    const response = await API.post(BASE_PATH, data);
    return response.data;
};

export const updatePricingStep2 = async (id, data) => {
    const response = await API.post(`${BASE_PATH}/${id}/pricing`, data);
    return response.data;
};

export const updateImagesStep3 = async (id, formData) => {
    // When passing FormData, axios automatically sets Content-Type to multipart/form-data
    // Do NOT wrap formData in an object {}
    const response = await API.post(`${BASE_PATH}/${id}/images`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateSpecsStep4 = async (id, specifications) => {
    const response = await API.post(`${BASE_PATH}/${id}/specs`, { specifications });
    return response.data;
};

export const updatePolicyStep5 = async (id, data) => {
    const response = await API.post(`${BASE_PATH}/${id}/policy`, data);
    return response.data;
};

export const publishProduct = async (id) => {
    const response = await API.patch(`${BASE_PATH}/${id}/publish`);
    return response.data;
};

export const getProductSummary = async (id) => {
    const response = await API.get(`${BASE_PATH}/${id}/summary`);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await API.get(`${BASE_PATH}/${id}`);
    return response.data;
};

export const updateBasicInfoStep1 = async (id, data) => {
    const response = await API.patch(`${BASE_PATH}/${id}/basic`, data);
    return response.data;
};
