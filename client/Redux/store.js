import { configureStore } from '@reduxjs/toolkit';
import redisFormSlice from './slices/redisFormSlice';
import awsSlice from './slices/awsSlice';
import sliderSlice from './slices/sliderSlice';

const store = configureStore(
  {
    reducer: {
      slider: sliderSlice,
      redis: redisFormSlice,
      aws: awsSlice,
    },
  }
);

export default store;
