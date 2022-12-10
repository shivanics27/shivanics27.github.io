window.onload = function(){
  const startBtn = document.getElementById('startBtn')
  const stopBtn = document.getElementById('stopBtn')
  const clearBtn = document.getElementById('clearBtn')
  stopBtn.disabled = true
  clearBtn.disabled = true
  this.build = null
  const mapLayer = document.getElementById('mapLayer')
  const map = L.map(mapLayer)
  const zoom = 14
  let marked = false
  let marker = null

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map)
  
  function drawMap(){
    let fid = '1oQovztzLCfHR7q_9IJk3P2eodiBQO9yH0wEnllnnFXc'
    let gid = '1595784905'
    let url = 'https://docs.google.com/spreadsheets/d/'+fid+'/gviz/tq?tqx=out:json&tq&gid='+gid
    let address = null
    fetch(url)
    .then(response=>response.text())
    .then((data)=>{
      data = JSON.parse(data.slice(47,-2))
      let lastLocation = data.table.rows[data.table.rows.length - 1]
      const coord = lastLocation.c[1].v
      const lat = coord.substr(0,coord.indexOf(','))
      const long = coord.substr(coord.indexOf(',') + 1,coord.length - 1)
      if(!marked){
        map.setView(L.latLng(lat,long),zoom)
        marked = true
        marker = L.marker([lat,long]).addTo(map)
        fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+lat+'&'+'lon='+long)
        .then(datum=>datum.json())
        .then(json=>{
          address = json.address.road + ',<br>' + json.address.city_district + ',<br>' + json.address.city
          marker.bindPopup('<b>'+address+'</b><br>').openPopup();
        })
      } else {
        marker.setLatLng([lat,long])
      }
    })
    clearBtn.disabled = false
  }
  
  startBtn.addEventListener('click',(e)=>{
    startBtn.disabled = true
    clearBtn.disabled = false
    stopBtn.disabled = false
    this.build = setInterval(drawMap,1000)
  })
  
  stopBtn.addEventListener('click',(e)=>{
    stopBtn.disabled = true
    startBtn.disabled = false
    clearInterval(this.build)
    this.build = null
  })
  
  clearBtn.addEventListener('click',(e)=>{
    clearBtn.disabled = true
    marker.remove()
    marked = false
  })
}
