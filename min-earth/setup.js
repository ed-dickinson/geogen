window.addEventListener( "earthjsload", function() {




	// setup earth
	myearth = new Earth( document.querySelector('#myearth'), {
		location: { lat: 0, lng: 20 },

    zoom: 1,
    zoomMin: 0.5,
    zoomMax: 2,
    quality: ( window.innerWidth <= 1024 ) ? 4 : 5,
		// light: 'simple',

		light: 'none',
    // transparent: true,
		mapLandColor : '#fff',
		// mapSeaColor : '#66d8ff',
    mapSeaColor : 'pink',
		// mapBorderColor : '#66d8ff',
    mapBorderColor : 'pink',
		mapBorderWidth : 0.5,

    dragPolarLimit : 0
	} );


	myearth.addEventListener( "ready", function() {

	} );

  let start_event
  const startDrag = () => {
    // console.log(event.id)
    start_event = event
    // console.log(myearth.mousePosition)
    console.log(myearth.camera.rotation)
  }

  let scale = 0.8

  const endDrag = () => {
    // console.log(event)
    let zoom = 1.2

    window.removeEventListener('mouseup', endDrag)

    let globe_size = myearth.isVisible * zoom

    // console.log(myearth.mousePosition)

    let initial_coords = myearth.options.location



    let moved = {x: start_event.screenX - event.screenX,
      y: event.screenY - start_event.screenY}
      // console.log(moved)

    let new_latitude = initial_coords.lat + (moved.y * (90/(globe_size/2)) * scale)
    let new_longitude = initial_coords.lng + ((moved.x * (90/(globe_size/2)) * scale))

    // console.log(moved.x, globe_size)
    console.log(myearth.camera.rotation)

    myearth.options.location = {lat: new_latitude, lng: new_longitude}
    myearth.goTo({lat: new_latitude, lng: new_longitude}, {zoom: 1.2, duration: 400})
  }

  myearth.addEventListener('mousedown', function(event) {
    console.log(event.id)
    startDrag()
    window.addEventListener('mouseup', endDrag)
  })

} );
