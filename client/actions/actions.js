export const SET_SENTINELS_VALUE = 'SET_SENTINELS_VALUE';
export const SET_SHARDS_VALUE = 'SET_SHARDS_VALUE';
export const SET_REPLICAS_VALUE = 'SET_REPLICAS_VALUE';

export const setSentinelsValue = value => ({
  type: SET_SENTINELS_VALUE,
  payload: value,
});

export const setShardsValue = value => ({
  type: SET_SHARDS_VALUE,
  payload: value,
});

export const setReplicasValue = value => ({
  type: SET_REPLICAS_VALUE,
  payload: value,
});
