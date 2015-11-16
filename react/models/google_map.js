// Application's facade around the google maps API
class GoogleMap {
  constructor(gMap) {
    this.gMap = gMap;
    this.reset();
  }

  reset() {
    this.initialFocusSet = false;
    _.forEach(this.markers || [], marker => marker.setMap(null));
    this.markers = [];
    this.idMarkers = {};
  }

  focus(place, addHighlightMarker) {
    if(!this.initialFocusSet) {
      this.initialFocusSet = true;
      if (addHighlightMarker) {
        // Only add the marker once the map is moved to the new location.
        google.maps.event.addListenerOnce(this.gMap, 'idle', () => {
          this.highlightMarker(place);
        });
      }
      this.fit(place);
    }
  }

  fit(place) {
    // google's place object: gMap.fitBounds(gPlace.geometry.viewport)
    if (place.viewport_lat_north && place.viewport_lat_south
        && place.viewport_lon_east && place.viewport_lon_west) {
      const bounds = {
        ne: {lat: place.viewport_lat_north, lng: place.viewport_lon_east},
        sw: {lat: place.viewport_lat_south, lng: place.viewport_lon_west}
      };
      this.gMap.fitBounds(
        new google.maps.LatLngBounds(bounds.sw, bounds.ne)
      );
    } else {
      this.gMap.setCenter({lat: place.lat, lng: place.lon});
      this.gMap.setZoom(place.geo_level == 'city' ? 9 : 4);
    }
  }

  marker(place, options, listener) {
    const existingMarker = this.idMarkers[place.id];
    if (existingMarker) return;

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
    this.idMarkers[place.id] = marker;
    this.markers.push(marker);
  }

  highlightMarker(place) {
    // the previous marker my not have been highlighted so remove it
    const existingMarker = this.idMarkers[place.id];
    if (existingMarker) existingMarker.setMap(null);

    const highlightOptions = {
      animation: google.maps.Animation.DROP,
    }
    this.marker(place, highlightOptions);
  }

  listen(eventName, listener) {
    google.maps.event.addListener(this.gMap, eventName, listener);
  }

  getBounds() {
    const bounds = this.gMap.getBounds();
    return {
      viewport_lat_north: bounds.getNorthEast().lat(),
      viewport_lat_south: bounds.getSouthWest().lat(),
      viewport_lon_east: bounds.getNorthEast().lng(),
      viewport_lon_west: bounds.getSouthWest().lng()
    }
  }

}

module.exports = GoogleMap
