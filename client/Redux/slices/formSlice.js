import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name:'form',
  initialState:{
    port:'',
    daemonize: false,
    clusterEnabled: true
  },
  reducers:{
    setPort:(state,action)=>{
      state.name = action.payload;
    },
    setDaemonize:(state,action)=>{
      state.email = action.payload;
    },
    setclusterEnabled:(state,action)=>{
      state.message = action.payload;
    }
  }
});

export const { setPort, setDaemonize, setclusterEnabled } = formSlice.actions;
export default formSlice.reducer;