import { createSlice } from "@reduxjs/toolkit";

const sliderSlice = createSlice({
  name:'slider',
  initialState:{
    sentinelsValue:1,
    shardsValue:2,
    replicasValue:3
  },
  reducers:{
    setSentinelsValue:(state,action)=>{
      state.sentinelsValue = action.payload;
    },
    setShardsValue:(state,action)=>{
      state.shardsValue = action.payload;
    },
    setReplicasValue:(state,action)=>{
      state.replicasValue = action.payload;
    }
  }
});

export const { setSentinelsValue, setShardsValue, setReplicasValue } = sliderSlice.actions;
export default sliderSlice.reducer;