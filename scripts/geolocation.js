let coords

function geoFindMe() {

  const status = dom.status.geolocation
  // const mapLink = document.querySelector('#map-link');

  // mapLink.href = '';
  // mapLink.textContent = '';

  function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;

    myearth.options.location = {lat: latitude, lng: longitude}
    myearth.goTo({lat: latitude, lng: longitude}, {zoom: 1.2, duration: 400})

    let today = new Date()
    let seasons = Date.getSeasons()
    console.log(seasons)

    const checkEquinox = (today, equinox) => {
      if (today.getMonth() === equinox.getMonth()) {
        return (today.getMonth() === 2 || today.getMonth() === 8) ?
           'equinox!' : 'solstice!'
      }
    }
    let season
    let equinox

    if (today >= seasons[1] && today < seasons[2]) {
        season = latitude >= 0 ? 'spring' : 'autumn';
        equinox = checkEquinox(today, seasons[1])
    } else if (today >= seasons[2] && today < seasons[3]) {
        season = latitude >= 0 ? 'summer' : 'winter';
        equinox = checkEquinox(today, seasons[2])
    } else if (today >= seasons[3] && today < seasons[4]) {
        season = latitude >= 0 ? 'autumn' : 'spring';
        equinox = checkEquinox(today, seasons[3])
    } else if (today >= seasons[4] || today < seasons[1]) {
        season = latitude >= 0 ? 'winter' : 'summer';
        equinox = checkEquinox(today, seasons[4])
    }

    status.textContent = '';
    // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    status.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

    status.innerHTML += `<br /><br />${season.replace(/^\w/, c => c.toUpperCase())}${equinox!==undefined?equinox.replace(/^\w/, c => c.toUpperCase()):''}`


    findBird(latitude, longitude)
    findPlace(latitude, longitude)
    findWeather(latitude, longitude)
  }

  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if(!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.innerHTML = 'Locating' + loading_dots;
    navigator.geolocation.getCurrentPosition(success, error);
  }

}

geoFindMe()
