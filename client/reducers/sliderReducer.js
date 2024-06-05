import {
  SET_SENTINELS_VALUE,
  SET_SHARDS_VALUE,
  SET_REPLICAS_VALUE,
} from '../actions/actions';

const initialState = {
  sentinelsValue: 0,
  shardsValue: 0,
  replicasValue: 0,
};

const sliderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SENTINELS_VALUE:
      return { ...state, sentinelsValue: action.payload };
    case SET_SHARDS_VALUE:
      return { ...state, shardsValue: action.payload };
    case SET_REPLICAS_VALUE:
      return { ...state, replicasValue: action.payload };
    default:
      return state;
  }
};

export default sliderReducer;
