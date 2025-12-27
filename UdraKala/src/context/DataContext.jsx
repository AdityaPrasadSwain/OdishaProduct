import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';
import Swal from 'sweetalert2';

// Create context
export const DataContext = createContext(null);

// Provider component
export const DataProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // --- Cart Logic ---

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Check stock limit
                if ((existingItem.quantity || 1) >= (product.stockQuantity || 100)) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'warning',
                        title: 'Maximum stock limit reached',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return prevCart;
                }
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Quantity updated',
                    showConfirmButton: false,
                    timer: 1500
                });
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
                );
            } else {
                // New item, check if stock > 0
                if ((product.stockQuantity || 0) < 1) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: 'Product is out of stock',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return prevCart;
                }
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Added to cart',
                    showConfirmButton: false,
                    timer: 1500
                });
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item => {
                if (item.id === productId) {
                    // Start Stock Validation
                    if (quantity > (item.stockQuantity)) {
                        Swal.fire({
                            toast: true,
                            position: 'top-end',
                            icon: 'warning',
                            title: 'Maximum stock limit reached',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        return item; // Do not update
                    }
                    return { ...item, quantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    // --- Seller Logic ---
    const addProduct = async (formData) => {
        try {
            const res = await API.post('/seller/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Optionally refresh public products if needed, though they might require admin approval
            // const refreshed = await API.get('/customer/products');
            // setProducts(refreshed.data || []);
            return res.data;
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    };

    return (
        <DataContext.Provider value={{
            categories,
            products,
            loading,
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
