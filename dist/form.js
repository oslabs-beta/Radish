import React from 'react';
import Slider from './Slider'; // Import the Slider component
import { useSelector } from 'react-redux';

function submitOptions() {
    let rgn = document.getElementById("options1").value;
    let insTyp = document.getElementById("options2").value;
    let OS = document.getElementById("options3").value;
    const shardsValue = useSelector(state => state.slider.shardsValue); 
    const replicasValue = useSelector(state => state.slider.replicasValue); 

    const selectedOptions = {
        region: rgn,
        instantType: insTyp,
        operatingSystem: OS,
        shardsValue: shardsValue,
        replicasValue: replicasValue
    };

    console.log("Region:", region);
    console.log("Instance Type:", instanceType);
    console.log("Operating System:", operatingSystem);
    console.log("Shards Value:", shardsValue);
    console.log("Replicas Value:", replicasValue);

    fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedOptions)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); 
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export { submitOptions };
