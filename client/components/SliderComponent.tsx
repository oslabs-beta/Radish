import ReactSlider from 'react-slider';
import React, { FC, ReactElement } from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;

}

const SliderComponent: FC<SliderProps> = ({ label, value, onChange } ): ReactElement => (
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
      // defaultValue={0}
      value={value}
      onChange={onChange}
      renderMark={props => {
        const key = props.key as number;
        if (key < value) {
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
