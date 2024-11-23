import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
  authState: boolean;
  token: string;
}

const initialState: IAuthState = {
  authState: false,
  token: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.authState = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { setAuthState, setToken } = authSlice.actions;
export const authReducer = authSlice.reducer; // Ensure you're exporting the reducer correctly
