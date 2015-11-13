class GoogleMap {
  constructor(gMap) {
    this.gMap = gMap;
    this.initialFocusSet = false;
  }

  initialFocus(place) {
    if(!this.initialFocusSet) {
      this.initialFocusSet = true;
      this.focus(place);
    }
  }

  focus(place) {
    // google's place object: gMap.fitBounds(gPlace.geometry.viewport)
    const bounds = {
      ne: {lat: place.viewport_lat_north, lng: place.viewport_lon_east},
      sw: {lat: place.viewport_lat_south, lng: place.viewport_lon_west}
    };
    this.gMap.fitBounds(
      new google.maps.LatLngBounds(bounds.sw, bounds.ne)
    );
  }
}

module.exports = GoogleMap
