import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { authReducer } from './authSlice'; // Import the reducer directly

// Noop storage for server-side rendering
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

// Persist config for the auth slice
const authPersistConfig = {
  key: 'auth',
  storage: storage,
};

const appReducer = combineReducers({
  auth: authReducer, // Use the reducer exported from authSlice
});

// Root reducer with reset functionality
const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_APP_STATE') {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(authPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

// Global reset action
export const resetAppState = () => ({ type: 'RESET_APP_STATE' });

// TypeScript types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
