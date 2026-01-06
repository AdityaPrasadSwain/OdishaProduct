import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import couponApi from '../../api/couponApi';

// Async Thunks
export const applyCoupon = createAsyncThunk(
    'coupon/apply',
    async ({ code, orderAmount, userId }, { rejectWithValue }) => {
        try {
            const response = await couponApi.applyCoupon({ couponCode: code, orderAmount }, userId);
            if (!response.valid) {
                return rejectWithValue(response.message);
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to apply coupon');
        }
    }
);

export const fetchAllCoupons = createAsyncThunk(
    'coupon/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await couponApi.getAllCoupons();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch coupons');
        }
    }
);

export const createCoupon = createAsyncThunk(
    'coupon/create',
    async (data, { rejectWithValue }) => {
        try {
            return await couponApi.createCoupon(data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create coupon');
        }
    }
);

export const updateCoupon = createAsyncThunk(
    'coupon/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await couponApi.updateCoupon(id, data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update coupon');
        }
    }
);

export const toggleCouponStatus = createAsyncThunk(
    'coupon/toggleStatus',
    async (id, { rejectWithValue }) => {
        try {
            return await couponApi.toggleStatus(id);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
        }
    }
);

export const deleteCoupon = createAsyncThunk(
    'coupon/delete',
    async (id, { rejectWithValue }) => {
        try {
            await couponApi.deleteCoupon(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete coupon');
        }
    }
);


const couponSlice = createSlice({
    name: 'coupon',
    initialState: {
        // User State
        activeCoupon: null, // { code, discountAmount, ... }
        discount: 0,
        finalTotal: 0,
        applicationLoading: false,
        applicationError: null,
        successMessage: null,

        // Admin State
        coupons: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCoupon: (state) => {
            state.activeCoupon = null;
            state.discount = 0;
            state.finalTotal = 0;
            state.applicationError = null;
            state.successMessage = null;
        },
        resetError: (state) => {
            state.error = null;
            state.applicationError = null;
        }
    },
    extraReducers: (builder) => {
        // Apply Coupon
        builder
            .addCase(applyCoupon.pending, (state) => {
                state.applicationLoading = true;
                state.applicationError = null;
                state.successMessage = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.applicationLoading = false;
                state.activeCoupon = action.payload;
                state.discount = action.payload.discountAmount;
                state.finalTotal = action.payload.finalAmount;
                state.successMessage = `Coupon applied! You saved ₹${action.payload.discountAmount}`;
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.applicationLoading = false;
                state.applicationError = action.payload;
                state.activeCoupon = null;
                state.discount = 0;
            });

        // Fetch All (Admin)
        builder
            .addCase(fetchAllCoupons.pending, (state) => { state.loading = true; })
            .addCase(fetchAllCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload;
            })
            .addCase(fetchAllCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create
        builder.addCase(createCoupon.fulfilled, (state, action) => {
            state.coupons.push(action.payload);
        });

        // Update & Toggle
        builder.addCase(updateCoupon.fulfilled, (state, action) => {
            const index = state.coupons.findIndex(c => c.id === action.payload.id);
            if (index !== -1) state.coupons[index] = action.payload;
        });
        builder.addCase(toggleCouponStatus.fulfilled, (state, action) => {
            const index = state.coupons.findIndex(c => c.id === action.payload.id);
            if (index !== -1) state.coupons[index] = action.payload;
        });

        // Delete
        builder.addCase(deleteCoupon.fulfilled, (state, action) => {
            state.coupons = state.coupons.filter(c => c.id !== action.payload);
        });
    }
});

export const { clearCoupon, resetError } = couponSlice.actions;
export default couponSlice.reducer;
