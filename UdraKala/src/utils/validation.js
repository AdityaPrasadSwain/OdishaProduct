export const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
};

export const validatePassword = (password) => {
    return password && password.length >= 8;
};

export const validatePAN = (pan) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
};

export const validateAadhaar = (aadhaar) => {
    return /^\d{12}$/.test(aadhaar);
};

export const validateGST = (gst) => {
    // Basic format: 2 digits + 5 chars + 4 digits + 1 char + 1 char + 1 char + 1 char
    // Regex: ^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-Z]{1}Z[0-9A-Z]{1}$
    // Simplified for robustness if regex is too strict for user variety
    return gst && gst.length === 15;
};

export const validateIFSC = (ifsc) => {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};
