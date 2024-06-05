import ReactSlider from 'react-slider';
import React from 'react';

const SliderComponent = ({ label, value, setValue }) => (
  <div className="sliderSection">
    <div className="sliderLabel">{label}</div>
    <ReactSlider
      className="customSlider"
      trackClassName="customSlider-track"
      thumbClassName="customSlider-thumb"
      markClassName="customSlider-mark"
      marks={1}
      min={0}
      max={10}
      defaultValue={0}
      value={value}
      onChange={setValue}
      renderMark={props => {
        if (props.key < value) {
          props.className = 'customSlider-mark customSlider-mark-before';
        } else if (props.key === value) {
          props.className = 'customSlider-mark customSlider-mark-active';
        }
        return <span {...props} />;
      }}
    />
    <div className="sliderValue">{value}</div>
  </div>
);
export default SliderComponent;
