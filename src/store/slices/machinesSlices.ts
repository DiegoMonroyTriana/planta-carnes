import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Machine = {
  name: string;
  id: string;
};

export type MachineState = {
  machines: [Machine] | null;
};

const initialState: MachineState = {
  machines: null,
};

const machineSlice = createSlice({
  name: 'machine',
  initialState,
  reducers: {
    setMachines(state, action: PayloadAction<[Machine]>) {
      state.machines = action.payload;
    },
  },
});

export default machineSlice.reducer;
