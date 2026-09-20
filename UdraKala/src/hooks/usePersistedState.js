import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * A custom hook to manage state synchronized with localStorage or sessionStorage.
 * @param {string} key - The storage key.
 * @param {any} defaultValue - The default value if nothing is in storage.
 * @param {'session' | 'local'} storageType - 'session' for sessionStorage, 'local' for localStorage.
 * @param {number|null} expiryMs - Optional expiry time in milliseconds (e.g., 24 * 60 * 60 * 1000 for 24 hours).
 * @returns {[any, function, function, boolean]} - [state, setState, clearState, isRestored]
 */
const usePersistedState = (key, defaultValue, storageType = 'session', expiryMs = null) => {
    const storage = storageType === 'local' ? window.localStorage : window.sessionStorage;
    const [isRestored, setIsRestored] = useState(false);
    
    // Lazy initialization
    const [state, setState] = useState(() => {
        if (typeof window === 'undefined') return defaultValue;
        
        try {
            const item = storage.getItem(key);
            if (item) {
                const parsedItem = JSON.parse(item);
                
                // Check for expiry
                if (parsedItem && parsedItem._timestamp && expiryMs) {
                    const now = new Date().getTime();
                    if (now - parsedItem._timestamp > expiryMs) {
                        storage.removeItem(key);
                        return defaultValue;
                    }
                }
                
                setIsRestored(true);
                return parsedItem.value !== undefined ? parsedItem.value : defaultValue;
            }
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            // If corrupted, remove it
            try { storage.removeItem(key); } catch (e) {}
        }
        
        return defaultValue;
    });

    const timeoutRef = useRef(null);

    // Sync state to storage with debouncing (300ms)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            try {
                const dataToStore = {
                    value: state,
                    _timestamp: new Date().getTime()
                };
                storage.setItem(key, JSON.stringify(dataToStore));
            } catch (error) {
                console.warn(`Error setting localStorage key "${key}":`, error);
            }
        }, 300);

        return () => clearTimeout(timeoutRef.current);
    }, [key, state, storage]);

    // Handle cross-tab synchronization
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleStorageChange = (e) => {
            if (e.key === key && e.storageArea === storage) {
                try {
                    if (e.newValue === null) {
                        setState(defaultValue);
                    } else {
                        const parsed = JSON.parse(e.newValue);
                        if (parsed && parsed.value !== undefined) {
                            setState(parsed.value);
                        }
                    }
                } catch (error) {
                    console.warn(`Error parsing storage change for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, storage, defaultValue]);

    const clearState = useCallback(() => {
        try {
            storage.removeItem(key);
        } catch (error) {
            console.warn(`Error removing storage key "${key}":`, error);
        }
        setState(defaultValue);
        setIsRestored(false);
    }, [key, storage, defaultValue]);

    return [state, setState, clearState, isRestored];
};

export default usePersistedState;
