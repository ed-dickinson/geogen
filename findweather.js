

let weather


const findWeather = (lat, lng) => {
  dom.status.weather.innerHTML = 'Finding weather' + loading_dots

  const findWindDirectionName = (deg) => {
    if (deg >= 157.5 && deg < 202.5) {
      wind_direction = 'southerly'
    } else if (deg >= 337.5 || deg < 22.5) {
      wind_direction = 'northerly'
    } else {
      wind_direction = ''
      if (deg >= 112.5 && deg < 247.5) {
        wind_direction = 'south '
      } else if (deg >= 292.5 || deg < 67.5) {
        wind_direction = 'north '
      }
      if (deg >= 22.5 && deg < 157.5) {
        wind_direction += 'easterly'
      } else if (deg >= 202.5 && deg < 337.5) {
        wind_direction += 'westerly'
      }

    }
    return wind_direction
  }


  // get(`http://api.geonames.org/findNearByWeatherJSON?formatted=true&lat=${lat}&lng=${lng}&username=ed1903&style=full`).then(res => {
  //   weather = res.weatherObservation
  //
  //   let wind_direction = findWindDirectionName(weather.windDirection)
  //
  //
  //   dom.status.weather.innerHTML = `
  //     <br />${weather.temperature}°C
  //     <br />${weather.humidity}% humidity
  //     <br />${weather.windSpeed} mph ${wind_direction} wind
  //   `
  // })

  let open_weather_key = 'b4b2af52611eaad0c3fd551079da6596'
  get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${open_weather_key}`).then(res => {
    weather = res

    let wind_direction = findWindDirectionName(weather.wind.deg)


    dom.status.weather.innerHTML = `
      ${(weather.main.temp - 273.15).toFixed(0)}°C
      <br />${weather.weather[0].main}
      <br />${weather.main.humidity}% humidity
      <br />${weather.wind.speed} mph ${wind_direction} wind
    `
  })



}
// xeno canto result is an object, with recordings: Array()
// q: quality 'A' - 'E'
// type: 'song' / "call"
// file-name: "XC631398-DM670679 (mp3cut.net).mp3"
// url is https://xeno-canto.org/sounds/uploaded/GVYPKAYRMJ/XC631398-DM670679%20%28mp3cut.net%29.mp3

// the equivalent search on their website
// https://xeno-canto.org/explore?query=lat:49%20lon:24%20q:A
