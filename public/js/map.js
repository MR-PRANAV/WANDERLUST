mapboxgl.accessToken = MAPTOKEN_A;

  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12',
      center: listing.geometry.coordinates,
      // center: [-74.5, 40],
      zoom: 9 // starting zoom
  });


  

  const marker1 = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(listing.geometry.coordinates)
        .setPopup( new mapboxgl.Popup({offset: 25})
        .setHTML(
          `<h6>${listing.title}</h6><p>Exact Location provided after booking </p>`))
        .addTo(map);
