import { createSlice } from '@reduxjs/toolkit';

const redisFormSlice = createSlice({
  name:'redis',
  initialState:{
    port:'',
    daemonize: false,
    clusterEnabled: true, 
    masterauth: '', 
    masteruser: '',
    saveSeconds: 5,
    saveChanges: 1,
    appendonly: false,
    appendfsync: 'everysec',
    loglevel: 'notice',
    timeout: 0,
    rdbcompression: true,
    rdbchecksum: true, 
    resplicaServeStaleData: true,
    maxmemory: 0,
    maxmemoryPolicy: 'noeviction',


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
    },
    setMasterauth:(state,action)=>{
      state.masteruath = action.payload;
    },
    setMasteruser:(state,action)=>{
      state.masteruser = action.payload;
    },
    setSaveSeconds:(state,action)=>{
      state.saveSeconds = action.payload;
    },
    setSaveChanges:(state,action)=>{
      state.saveChanges = action.payload;
    },
    setAppendonly:(state,action)=>{
      state.appendonly = action.payload;
    },
    setAppendfsync:(state,action)=>{
      state.appendfsync = action.payload;
    },
    setLoglevel:(state,action)=>{
      state.loglevel = action.payload;
    },
    setTimeout:(state,action)=>{
      state.timeout = action.payload;
    },
    setRdbcompression:(state,action)=>{
      state.rdbcompression = action.payload;
    },
    setRdbchecksum:(state,action)=>{
      state.rdbchecksum = action.payload;
    },
    setResplicaServeStaleData:(state,action)=>{
      state.resplicaServeStaleData = action.payload;
    },
    setMaxmemory:(state,action)=>{
      state.maxmemory = action.payload;
    },
    setMaxmemoryPolicy:(state,action)=>{
      state.maxmemoryPolicy = action.payload;
    },
  }
});

export const { setPort, setDaemonize, setclusterEnabled } = redisFormSlice.actions;
export default redisFormSlice.reducer;