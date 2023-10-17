import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MttrType = {
  date: string;
  fixesNumber: number;
  fixesTime: number;
};

export type MtbfTye = {
  availability: number;
  unavailability: number;
  stopsNumber: number;
  date: string;
};

export type MttrState = {
  mttr: MttrType | null;
};

export type MtbfState = {
  mtbf: MtbfTye | null;
};

const initialState: MttrState & MtbfState = {
  mttr: null,
  mtbf: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setMttr(state, action: PayloadAction<MttrType>) {
      state.mttr = action.payload;
    },
    setMtbf(state, action: PayloadAction<MtbfTye>) {
      state.mtbf = action.payload;
    },
  },
});

export default dashboardSlice.reducer;
