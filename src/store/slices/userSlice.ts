import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Role = 'admin' | 'user';

export type User = {
  name: string;
  email: string;
  id: string;
  role: Role;
};

export type UserState = {
  user: User | null;
};

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export default userSlice.reducer;
