import { configureStore } from '@reduxjs/toolkit';
import redisFormSlice from './slices/redisFormSlice';
import awsSlice from './slices/awsSlice';
import sliderSlice from './slices/sliderSlice';
import { useDispatch, useSelector } from 'react-redux';

const store = configureStore(
  {
    reducer: {
      slider: sliderSlice,
      redis: redisFormSlice,
      aws: awsSlice,
    },
  }
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export default store;
