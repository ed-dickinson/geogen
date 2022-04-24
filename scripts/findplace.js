// import secrets from '/scripts/modules/secrets.js'

let place
let town


const findPlace = (lat, lng) => {
  dom.status.place.innerHTML = 'Finding place info' + loading_dots

  let in_progress = true

  const finishLoad = () => {
    if (in_progress) {
      in_progress = false
      dom.status.place.innerHTML = ''
    }
  }



  get(`https://secure.geonames.org/findNearbyPlaceNameJSON?formatted=true&lat=${lat}&lng=${lng}&username=${secrets.GEONAMES}&style=full`).then(res => {
    town = res.geonames[0]
    finishLoad()
    let location_array = [town.adminName5, town.adminName4, town.adminName3, town.adminName2, town.adminName1]
    let full_town_location = ''
    location_array.forEach(x=>{
      if (x !== town.name && x !== '') {
        full_town_location += x
        if (location_array.indexOf(x) !== 4) {
          full_town_location += ', '
        }
      }

    })

    dom.status.place.innerHTML += `<strong>${town.name}</strong>, ${full_town_location}
      <br />Time zone: GMT${town.timezone.gmtOffset<0?'-':'+'}${town.timezone.gmtOffset} ${town.timezone.dstOffset!==0?'(Daylight Savings)':''}`
    console.log(res)
  })


  get(`http://api.geonames.org/findNearbyWikipediaJSON?formatted=true&lat=${lat}&lng=${lng}&username=${secrets.GEONAMES}&style=full`).then(res => {

    // let landmark = res.geonames.find(x=>{return x.feature === 'landmark'})
    // if (landmark !== undefined) {
    //   place = landmark
    // } else {
    //   place = res.geonames[0];
    // }
    place = res.geonames[0]

    finishLoad()
    dom.status.landmark.innerHTML += `Nearby: <strong>${place.title}</strong><br />${place.summary.slice(0,-5)}(<a href="https://${place.wikipediaUrl}" class="summary-link" target="_blank">Link</a>)<br />`



  });
}
//for geonames replace api with secure and http with https


// xeno canto result is an object, with recordings: Array()
// q: quality 'A' - 'E'
// type: 'song' / "call"
// file-name: "XC631398-DM670679 (mp3cut.net).mp3"
// url is https://xeno-canto.org/sounds/uploaded/GVYPKAYRMJ/XC631398-DM670679%20%28mp3cut.net%29.mp3

// the equivalent search on their website
// https://xeno-canto.org/explore?query=lat:49%20lon:24%20q:A
