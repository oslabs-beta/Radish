import { createStore } from 'redux';
import sliderReducer from './reducers/sliderReducer';

const store = createStore(sliderReducer);

export default store;
