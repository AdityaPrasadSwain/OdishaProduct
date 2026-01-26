const API_BASE_URL = "http://localhost:8085/api";

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        return {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + user.accessToken
        };
    } else {
        return { "Content-Type": "application/json" };
    }
};

const getAuthHeadersMultipart = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
        return {
            "Authorization": "Bearer " + user.accessToken
        };
    } else {
        return {};
    }
};

export const createProductStep1 = async (data) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to create product");
    }
    return response.json();
};

export const updatePricingStep2 = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/pricing`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update pricing");
};

export const updateImagesStep3 = async (id, newFiles, existingUrls, reelFile) => {
    const formData = new FormData();

    // Append new files
    if (newFiles && newFiles.length > 0) {
        newFiles.forEach((file) => {
            formData.append("images", file);
        });
    }

    // Append existing URLs to be kept (Logic requires backend update)
    // If we can't update backend signature easily for 'keptImages', 
    // we might need to rely on the fact that we ONLY append new ones? 
    // BUT the backend currently CLEARS lists.
    // So we MUST send existing Urls as a param. 
    // Let's assume we can send a separate `keptImages` param.
    if (existingUrls && existingUrls.length > 0) {
        existingUrls.forEach(url => formData.append("keptImages", url));
    }

    // Append Reel file
    // The component might pass it as 'reelFile' in newFiles or separately?
    // Let's assume the component calls this function differently or we extend arguments.
    // Argument list is: (id, newFiles, existingUrls)
    // We can check if `newFiles` contains a property `reel`? No, newFiles is expected to be array of images.
    // Let's add a 4th argument: reelFile
    // updateImagesStep3 = async (id, newFiles, existingUrls, reelFile)


    if (reelFile) {
        formData.append("reel", reelFile);
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}/images`, {
        method: "POST",
        headers: getAuthHeadersMultipart(),
        body: formData,
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to update images");
    }
};

export const updateSpecsStep4 = async (id, specifications) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/specs`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ specifications }),
    });
    if (!response.ok) throw new Error("Failed to update specifications");
};

export const updatePolicyStep5 = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/policy`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update policy");
};

export const publishProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/publish`, {
        method: "PATCH",
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to publish product");
};

export const updateProductBasic = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/basic`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to update product basic info");
    }
};

export const getProductSummary = async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/summary`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch product summary");
    return response.json();
};

export const getDrafts = async () => {
    const response = await fetch(`${API_BASE_URL}/seller/products/drafts`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch drafts");
    return response.json();
};

export const getMyProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/seller/products`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
};

