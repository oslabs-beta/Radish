import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliderState {
  sentinelsValue: number;
  shardsValue: number;
  replicasValue: number;

}

const initialState: SliderState = {
  sentinelsValue:1,
  shardsValue:2,
  replicasValue:3
};


const sliderSlice = createSlice({
  name:'slider',
  initialState:initialState,
  reducers:{
    setSentinelsValue:(state, action: PayloadAction<number>)=>{
      state.sentinelsValue = action.payload;
    },
    setShardsValue:(state, action: PayloadAction<number>)=>{
      state.shardsValue = action.payload;
    }, 
    setReplicasValue:(state, action: PayloadAction<number>)=>{
      state.replicasValue = action.payload;
    }
  }
});

export const { setSentinelsValue, setShardsValue, setReplicasValue } = sliderSlice.actions;
export default sliderSlice.reducer;