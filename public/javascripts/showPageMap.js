
mapboxgl.accessToken = token;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 5 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5> ${campground.title} </h5>`
            )
    )
    .addTo(map)