import { createContext, useState, useContext, useEffect } from "react";

const SellerRegistrationContext = createContext();

export const SellerRegistrationProvider = ({ children }) => {
    const [sellerData, setSellerData] = useState({
        // Step 1: Personal
        fullName: "",
        mobile: "",
        email: "",
        password: "", // Required for account creation
        profilePhoto: null,
        profilePhotoPreview: null,

        // Step 2: Business
        businessName: "",
        businessType: "",
        address: "",
        state: "",
        city: "",
        pincode: "",

        // Step 3: KYC & Bank
        panNumber: "",
        aadhaarNumber: "",
        gstNumber: "",
        bankAccountNo: "", // specific naming from backend
        ifscCode: "",
        bankName: "",
        accountHolderName: "",

        // Files
        panFile: null,
        aadhaarFile: null,
        gstFile: null,

        // Previews
        panPreview: null,
        aadhaarPreview: null,
        gstPreview: null
    });

    const updateSellerData = (newData) => {
        setSellerData((prev) => ({ ...prev, ...newData }));
    };

    return (
        <SellerRegistrationContext.Provider value={{ sellerData, updateSellerData, setSellerData }}>
            {children}
        </SellerRegistrationContext.Provider>
    );
};

export const useSellerRegistration = () => useContext(SellerRegistrationContext);
