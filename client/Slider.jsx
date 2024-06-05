import SliderComponent from './SliderComponent';
import React, { useState } from 'react';

const Slider = () => {
  const [sentinelsValue, setSentinelsValue] = useState(0);
  const [shardsValue, setShardsValue] = useState(0);
  const [replicasValue, setReplicasValue] = useState(0);

  return (
    <div>
      <SliderComponent
        label="Number of sentinels"
        value={sentinelsValue}
        setValue={setSentinelsValue}
      ></SliderComponent>

      <SliderComponent
        label="Number of shards"
        value={shardsValue}
        setValue={setShardsValue}
      />

      <SliderComponent
        label="Number of replicas"
        value={replicasValue}
        setValue={setReplicasValue}
      />
    </div>
  );
};

export default Slider;
