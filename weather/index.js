const APIKey = 'e1f10a1e78da46f5b10a1e78da96f525'
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"]
let cities = {
  cities:['Bangalore','Delhi','Lucknow','Ahmedabad','Allahabad','Bhopal','Chennai','Mumbai'],
  lat:[12.986,28.519,26.842,23.026,25.433,23.257,13.086,19.074],
  long:[77.591,77.167,80.942,72.585,81.839,77.402,80.268,72.875]
}
const weatherReport = {
  city:null,
  date:null,
  temperature:null,
  humidity:null,
  uvIndex:null,
  windspeed:null,
  airQuality:null,
  dayOrNight:null,
  cloudPhrase:null
}

const searchbox = document.getElementById('searchBox')
let searchLetters = 0
const autocomplete = document.getElementById('autocomplete')

searchbox.addEventListener('input',(e)=>{
  if(e.inputType == 'deleteContentBackward' && e.target.value == ''){
    search2s = 0
    for(let child of autocomplete.children){child.innerText = ''}
    return
  }
  
  if(searchbox.value.length > 1){autocomplete.style.visibility = 'visible'}
  
  if(searchLetters == 0)
    searchLetters = 1
  else
    if(searchLetters == 1)
      searchLetters = 2
  else
    searchLetters-=1
  
  if(searchLetters == 2){
    queryCities(searchbox.value).then(places => {
      for(let i = 0; i < autocomplete.children.length; i++){
        if(i >= places.cities.length)
          autocomplete.children[i].innerText = ''
        else
          autocomplete.children[i].innerText = places.cities[i]
      }
    })
  }
})

async function queryCities(query){
  const url = 'https://api.weather.com/v3/location/search?apiKey=' + APIKey + '&language=en-IN&query=' + query + '&locationType=city%2Cairport%2CpostCode%2Cpws&format=json'
  
  const response = await fetch(url).then(response => response.json())
  
  cities = {cities: response.location.address,
            lat: response.location.latitude,
            long: response.location.longitude
           }
  
  return cities
}

async function queryWeather(city){
  const geocode = cities.lat[city] + '%2C' + cities.long[city]
  const url = 'https://api.weather.com/v3/aggcommon/v3alertsHeadlines;v3-wx-observations-current;v3-location-point?apiKey=' + APIKey + '&geocodes=' + geocode + '&language=en-US&units=m&format=json'
  const airURL = 'https://api.weather.com/v3/wx/globalAirQuality?apiKey=' + APIKey + '&geocode=' + geocode + '&language=en-IN&format=json&scale=NAQI'
  
  const weatherDetails = await fetch(url).then(response => response.json())
  const airDetails = await fetch(airURL).then(response => response.json())
  //const weatherReport = {}
  
  const weather = weatherDetails[0]['v3-wx-observations-current']
  weatherReport.city = weatherDetails[0]['v3-location-point'].location.city
  weatherReport.uvIndex = weather.uvDescription
  weatherReport.temperature = weather.temperature
  weatherReport.humidity = weather.relativeHumidity
  weatherReport.date = weather.dayOfWeek + ', ' + weather.validTimeLocal.substring(8,10) + ' ' + month[Number(weather.validTimeLocal.substring(5,7)) - 1]
  weatherReport.windspeed = weather.windSpeed
  weatherReport.airQuality = airDetails.globalairquality.airQualityCategory
  weatherReport.dayOrNight = weather.dayOrNight
  weatherReport.cloudPhrase = weather.cloudCoverPhrase
  DayOrNight = weather.dayOrNight
  
  return weatherReport
}

//window.onload = function(){for(let child of autocomplete.children){child.innerText = ''}}
window.onload = function(){document.getElementById('place1').click()}

searchbox.onfocus = function(){
  if(searchbox.value.length >= 0 && document.getElementById('place1').textContent != ''){autocomplete.style.visibility = 'visible'}
}

searchbox.addEventListener('focusout',()=>{
  window.setTimeout(()=>{autocomplete.style.visibility = 'hidden'},300)
})

autocomplete.addEventListener('click',(e)=>{
  autocomplete.style.visibility = 'hidden'
  if(e.target.tagName == 'P'){
    if(cities != {}){
      const city = Number(e.target.id.substring(5)) - 1
      queryWeather(city).then(weather=>{
        updateWeatherIcon(weather.cloudPhrase,weather.dayOrNight)
        document.getElementById('cityName').textContent = weather.city
        document.getElementById('temperatureValue').innerHTML = weather.temperature + '&#176C'
        document.getElementById('uvValue').textContent = weather.uvIndex
        document.getElementById('humidityValue').textContent = weather.humidity
        document.getElementById('windValue').textContent = weather.windspeed + ' km/h'
        document.getElementById('dateValue').textContent = weather.date
        document.getElementById('airValue').textContent = weather.airQuality
      })
    }
  }
})

function changeUI(dayornight){
  switch(dayornight){
    case 'D':
      document.getElementsByTagName('body')[0].style.background = 'linear-gradient(135deg,slategray,lightblue,lavenderblush,lightsteelblue,slategray)'
      document.getElementById('effect').style.boxShadow = 'inset 16px 0 60px 30px rgba(238, 238, 238, 0.75), inset 128px 0 100px 60px rgba(255, 0, 255, 0.75), inset -64px 0 140px 90px rgba(0, 255, 255, 0.75)'
      break;
    case 'N':
      document.getElementsByTagName('body')[0].style.background = 'linear-gradient(45deg, black, linen)'
      document.getElementById('effect').style.boxShadow = 'rgba(255, 222, 173, 0.75) 16px 0px 60px 30px inset, rgba(38, 16, 232, 0.75) 128px 0px 100px 60px inset, rgba(255, 129, 18, 0.75) -64px 0px 140px 90px inset, rgba(227, 26, 11, 0.25) 16px 16px 60px 30px, rgba(235, 12, 105, 0.125) 16px 128px 128px 16px'
      break;
  }
}

function updateWeatherIcon(cloudPhrase,dayornight){
  changeUI(dayornight)
  let iconLocation = 'images/clouds/'
  if(dayornight == 'D'){
    iconLocation = iconLocation + 'day/'
  } else {
    iconLocation = iconLocation + 'night/'
  }
  
  switch(cloudPhrase){
    case 'Clear':
      iconLocation = iconLocation + 'clear'
      break;
    case 'Partly Cloudy':
      iconLocation = iconLocation + 'partly cloudy'
      break;
    case 'Mostly Cloudy':
      iconLocation = iconLocation + 'cloudy'
      break;
    case 'Cloudy':
      iconLocation = iconLocation + 'mostly cloudy'
      break;
    case 'Scattered Thunderstorms':
      iconLocation = iconLocation + 'thunder rain'
      break;
    case 'Isolated Thunderstorms':
      iconLocation = iconLocation + 'thunderstorm'
      break;
    case 'Sunny':
      iconLocation = iconLocation + 'sunny'
      break;
    case 'Mostly Sunny':
      iconLocation = iconLocation + 'mostly sunny'
      break;
    default:
      iconLocation = iconLocation + 'default'
  }
  
  iconLocation = iconLocation + '.png'
  document.getElementById('weatherIcon').src = iconLocation
}