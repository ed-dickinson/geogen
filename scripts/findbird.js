

let bird


// find bird has stopped working for some reason when chaning place & weather and equinoxer to modules ??????


const findBird = (lat, lng) => {
  dom.status.bird.innerHTML = 'Finding birds' + loading_dots

  get(`https://xeno-canto.org/api/2/recordings?query=lat:${lat}+${lng}:24+q:A`).then(res => {
    if (res.recordings.length === 0) {
      dom.status.bird.innerHTML = 'No birds found, widening search' + loading_dots
      get(`https://xeno-canto.org/api/2/recordings?query=box:${lat-1},${lng-1},${lat+1},${lng+1}+q:A`).then(res => {
        if (res.recordings.length === 0) {
          dom.status.bird.innerHTML = 'No birds found :('
        } else {
          bird = res.recordings[0];
          dom.status.bird.innerHTML = `Local-ish bird: ${bird.en} <i>(${bird.gen} ${bird.sp})</i>`
        }
      })
    } else {
      bird = res.recordings[0];

      dom.status.bird.innerHTML = `Local bird: ${bird.en} <i>(${bird.gen} ${bird.sp})</i>`
    }
  });
}
// xeno canto result is an object, with recordings: Array()
// q: quality 'A' - 'E'
// type: 'song' / "call"
// file-name: "XC631398-DM670679 (mp3cut.net).mp3"
// url is https://xeno-canto.org/sounds/uploaded/GVYPKAYRMJ/XC631398-DM670679%20%28mp3cut.net%29.mp3

// the equivalent search on their website
// https://xeno-canto.org/explore?query=lat:49%20lon:24%20q:A
