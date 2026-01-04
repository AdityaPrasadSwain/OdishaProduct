const API_BASE_URL = "http://localhost:8080/api/products";

export const createProductStep1 = async (data) => {
    const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to create product");
    }
    return response.json();
};

export const updatePricingStep2 = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/${id}/pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update pricing");
};

export const updateImagesStep3 = async (id, imageUrls) => {
    const response = await fetch(`${API_BASE_URL}/${id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls }),
    });
    if (!response.ok) throw new Error("Failed to update images");
};

export const updateSpecsStep4 = async (id, specifications) => {
    const response = await fetch(`${API_BASE_URL}/${id}/specs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specifications }),
    });
    if (!response.ok) throw new Error("Failed to update specifications");
};

export const updatePolicyStep5 = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/${id}/policy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update policy");
};

export const publishProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}/publish`, {
        method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to publish product");
};

export const getProductSummary = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}/summary`);
    if (!response.ok) throw new Error("Failed to fetch product summary");
    return response.json();
};
