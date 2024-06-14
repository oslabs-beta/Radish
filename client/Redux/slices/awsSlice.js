import { createSlice } from "@reduxjs/toolkit";

const awsSlice = createSlice({
  name:'aws',
  initialState:{
    serverType:''
  },
  reducers:{
    setServerType:(state,action)=>{
      state.serverType = action.payload;
    }
  }
});

export const { setServerType } = awsSlice.actions;
export default awsSlice.reducer;
