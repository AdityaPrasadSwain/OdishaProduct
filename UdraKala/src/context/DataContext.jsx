import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

// Create context
export const DataContext = createContext(null);

// Provider component
export const DataProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get('/categories');
                console.log("[DataContext] Fetched categories:", res.data);
                setCategories(res.data || []);
            } catch (error) {
                console.error('[DataContext] Failed to load categories', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await API.get('/customer/products');
                console.log("[DataContext] Fetched public products:", res.data);
                setProducts(res.data || []);
            } catch (error) {
                console.error('[DataContext] Failed to load public products', error);
                setProducts([]); // Set empty array on error
            }
        };
        fetchProducts();
    }, []);

    // Add product helper (for sellers)
    const addProduct = async (productData) => {
        const config = {
            headers: {}
        };

        if (productData instanceof FormData) {
            // Explicitly set to undefined to override the default 'application/json' in api.js
            // This allows the browser to set 'multipart/form-data' with the correct boundary
            config.headers['Content-Type'] = undefined;
        }

        const res = await API.post('/seller/products', productData, config);
        return res.data;
    };

    // Add to cart function
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                // Increment quantity if already in cart
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item with quantity 1
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    // Remove from cart function
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    // Update cart item quantity
    const updateCartQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
    };

    return (
        <DataContext.Provider value={{
            categories,
            products,
            addProduct,
            cart,
            setCart,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart
        }}>
            {children}
        </DataContext.Provider>
    );
};

/* ===== SAFE HOOK ===== */
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used inside DataProvider');
    }
    return context;
};
