import React from 'react';
import SliderComponent from './SliderComponent';
import { useSelector, useDispatch } from 'react-redux';
import {
  setShardsValue,
  setReplicasValue,
} from '../Redux/slices/sliderSlice';

import { useAppSelector } from '../Redux/store';

const Slider = () => {
  const dispatch = useDispatch();
  const sentinelsValue = useAppSelector(state => state.slider.sentinelsValue);
  const shardsValue = useAppSelector(state => state.slider.shardsValue);
  const replicasValue = useAppSelector(state => state.slider.replicasValue);

  console.log('shardsValue', shardsValue);
  console.log('replicasValue', replicasValue);

  return (
    <div className="space-y-4">
      <SliderComponent
        label="Number of shards"
        value={shardsValue}
        onChange={(value: number) => dispatch(setShardsValue(value))}
      />

      <SliderComponent
        label="Number of replicas"
        value={replicasValue}
        onChange={(value: number) => dispatch(setReplicasValue(value))}
      />
    </div>
  );
};


export default Slider;