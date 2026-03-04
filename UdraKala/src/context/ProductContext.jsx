import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProductSummary } from '../../../src/api/productWizardApi';

const ProductContext = createContext();

export const useProductContext = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children, productId: propProductId }) => {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        categoryId: 'ef9b5636-2244-486a-b286-64cc1c641886',
        material: '',
        color: '',
        size: '',
        origin: '',
        packOf: '1',
        price: '',
        discountPrice: '',
        stockQuantity: '',
        minOrderQuantity: 1,
        maxOrderQuantity: 10,
        isCodAvailable: true,
        imageUrls: [], // For display/logic
        specifications: [],
        reelUrl: '',
        dispatchDays: '',
        returnAvailable: false,
        returnWindowDays: '',
        returnPolicyDescription: '',
        cancellationAvailable: true
    });
    const [loading, setLoading] = useState(false);
    const [productId, setProductId] = useState(propProductId || null);

    // If a productId is passed via props (or set later), fetch data
    useEffect(() => {
        if (propProductId) {
            setProductId(propProductId);
        }
    }, [propProductId]);

    useEffect(() => {
        if (productId) {
            fetchProductData(productId);
        }
    }, [productId]);

    const fetchProductData = async (id) => {
        setLoading(true);
        try {
            const data = await getProductSummary(id);
            setProductData(prev => ({
                ...prev,
                ...data,
                // Ensure arrays/objects are merged or replaced correctly
                specifications: data.specifications || [],
                imageUrls: data.imageUrls || []
            }));
        } catch (err) {
            console.error("Failed to fetch product data", err);
        } finally {
            setLoading(false);
        }
    };

    const updateProductData = (key, value) => {
        setProductData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const setFullProductData = (data) => {
        setProductData(prev => ({ ...prev, ...data }));
    };

    const value = {
        productData,
        setProductData,
        updateProductData,
        setFullProductData,
        loading,
        setLoading,
        productId,
        setProductId,
        fetchProductData
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
