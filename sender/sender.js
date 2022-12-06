window.onload = function(){
  const startBtn = document.getElementById('startBtn')
  const stopBtn = document.getElementById('stopBtn')
  this.sender = null
  this.xhttp = new XMLHttpRequest()
  const message = document.getElementById('message')
  let started = false
  
  function sendPos(position){
    const latlong = position.coords.latitude + "," + position.coords.longitude
    xhttp.open("POST", "https://docs.google.com/forms/d/e/1FAIpQLScfS-4zCXKDlFJjBtpIozF3C6Ja80_rIMFhqqkqD41Aj85_Nw/formResponse", true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send(("entry.1429439032=" + latlong))
  }
  
  function getLocation(){
    if(navigator.geolocation)
      navigator.geolocation.getCurrentPosition(sendPos)
    else
      window.alert('Request failed')
  }
  
  startBtn.addEventListener('click',(e)=>{
    if(!started){
      started = true
      startBtn.disabled = true
      stopBtn.disabled = false
      this.sender = setInterval(getLocation,1000)
      message.textContent = 'Geolocation transmission initiated'
    }
  })
  
  stopBtn.addEventListener('click',(e)=>{
    if(started){
      started = false
      stopBtn.disabled = true
      startBtn.disabled = false
      clearInterval(this.sender)
      this.sender = null
      message.textContent = 'Geolocation transmission terminated'
    }
  })
}
