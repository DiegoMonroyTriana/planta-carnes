import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import machinesSlices from './slices/machinesSlices';

const rootReducer = combineReducers({
  user: userSlice,
  machines: machinesSlices,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
