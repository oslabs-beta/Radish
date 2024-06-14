function submitOptions() {
    let rgn = document.getElementById("options1").value;
    let insTyp = document.getElementById("options2").value;
    let OS = document.getElementById("options3").value;
  
    const selectedOptions = {
        region: rgn,
        instantType: insTyp,
        operatingSystem: OS,
        shardsValue: shardsValue, // Access from Redux store
        replicasValue: replicasValue // Access from Redux store
    };
  
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
