import React from 'react';
import SliderComponent from './SliderComponent';
import { useSelector, useDispatch } from 'react-redux';
import {
  setShardsValue,
  setReplicasValue,
} from '../Redux/slices/sliderSlice';

const Slider = () => {
  const dispatch = useDispatch();
  const shardsValue = useSelector(state => state.slider.shardsValue);
  const replicasValue = useSelector(state => state.slider.replicasValue);

  console.log('shardsValue', shardsValue);
  console.log('replicasValue', replicasValue);

  return (
    <div className="space-y-4">
      <SliderComponent
        label="Number of shards"
        value={shardsValue}
        onChange={value => dispatch(setShardsValue(value))}
      />

      <SliderComponent
        label="Number of replicas"
        value={replicasValue}
        onChange={value => dispatch(setReplicasValue(value))}
      />
    </div>
  );
};


export default Slider;