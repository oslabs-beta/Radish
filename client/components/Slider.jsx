import SliderComponent from './SliderComponent';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSentinelsValue,
  setShardsValue,
  setReplicasValue,
} from '../Redux/slices/sliderSlice';

const Slider = () => {
  // const [sentinelsValue, setSentinelsValue] = useState(0);
  // const [shardsValue, setShardsValue] = useState(0);
  // const [replicasValue, setReplicasValue] = useState(0);

  const dispatch = useDispatch();
  const sentinelsValue = useSelector(state => state.slider.sentinelsValue);
  const shardsValue = useSelector(state => state.slider.shardsValue);
  const replicasValue = useSelector(state => state.slider.replicasValue);

  console.log('sentinelsValue', sentinelsValue);
  console.log('shardsValue', shardsValue);
  console.log('replicasValue', replicasValue);

  return (
    <div className="space-y-4">
      {/* <SliderComponent
        label="Number of sentinels"
        value={sentinelsValue}
        onChange={value => dispatch(setSentinelsValue(value))}
      ></SliderComponent> */}

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
