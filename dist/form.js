function submitOptions() {
    let region = document.getElementById("options1").value;
    let instanceType = document.getElementById("options2").value;
    let operatingSystem = document.getElementById("options3").value;
  
    const selectedOptions = {userData: [region,instanceType, operatingSystem]};
  
    console.log(selectedOptions);
}


  