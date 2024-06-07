import { configureStore } from '@reduxjs/toolkit';
import formSlice from './slices/formSlice';
import awsSlice from './slices/awsSlice';
import sliderSlice from './slices/sliderSlice';

const store = configureStore(
  {
    reducer: {
      slider: sliderSlice,
      form: formSlice,
      aws: awsSlice,
    },
  }
);

export default store;
