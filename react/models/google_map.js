// Application's facade around the google maps API
class GoogleMap {
  constructor(gMap) {
    this.gMap = gMap;
    this.initialFocusSet = false;
    this.markers = [];
  }

  focus(place) {
    if(!this.initialFocusSet) {
      this.initialFocusSet = true;
      this.fit(place);
    }
  }

  fit(place) {
    // google's place object: gMap.fitBounds(gPlace.geometry.viewport)
    const bounds = {
      ne: {lat: place.viewport_lat_north, lng: place.viewport_lon_east},
      sw: {lat: place.viewport_lat_south, lng: place.viewport_lon_west}
    };
    this.gMap.fitBounds(
      new google.maps.LatLngBounds(bounds.sw, bounds.ne)
    );
  }

  marker(place, options, listener) {
    const markerOptions = _.assign(
      {
        position: {lat: place.lat, lng: place.lon},
        map: this.gMap,
        title: place.name
      },
      options
    );
    const marker = new google.maps.Marker(markerOptions);
    if (listener) marker.addListener('click', listener);
    this.markers.push(marker);
  }

  highlightMarker(place) {
    const highlightOptions = {
      animation: google.maps.Animation.DROP,
    }
    setTimeout(() => {
      this.marker(place, highlightOptions);
    },800);
  }
}

module.exports = GoogleMap
