import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import courseReducer from '../features/courses/courseSlice';

export const store = configureStore({
    reducer: {
        courses: courseReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
// FIX: Added a trailing comma inside the generic to fix TSX parsing error
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
