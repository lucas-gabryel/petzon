import { configureStore } from "@reduxjs/toolkit";
import likeSlice from "../components/multiActionAreaCard/LikeSlice"

export const store = configureStore({
    reducer: {
        like: likeSlice,      
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;