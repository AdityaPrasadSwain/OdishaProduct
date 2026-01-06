import { configureStore } from '@reduxjs/toolkit';
import couponReducer from './slices/couponSlice';

export const store = configureStore({
    reducer: {
        coupon: couponReducer,
    },
});

export default store;
