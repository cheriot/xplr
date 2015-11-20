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

  focus(place, addHighlightMarker, closest) {
    if(!this.initialFocusSet) {
      this.initialFocusSet = true;
      if (addHighlightMarker) {
        // Only add the marker once the map is moved to the new location.
        google.maps.event.addListenerOnce(this.gMap, 'idle', () => {
          this.highlightMarker(place);
        });
      }

      if (!_.isEmpty(closest)) {
        this.fitPoints(place, closest);
      } else {
        // fall back on the place api's viewport
        this.fitViewport(place);
      }
    }
  }

  fitPoints(place, closest) {
    const point = {lat: place.lat, lng: place.lon};
    const bounds = new google.maps.LatLngBounds(point, point);
    _.forEach(closest, p => {
      bounds.extend(this.latLng(p))
    });
    this.gMap.fitBounds(bounds);
  }

  fitViewport(place) {
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
        title: place.name,
        icon: {
          path: 'M24-8c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h32c4.4 0 8 3.6 8 8v32z',
          fillColor: 'red',
          fillOpacity: 1,
          scale: 0.2,
          strokeColor: 'white',
          strokeWeight: 2
        },
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

    // http://map-icons.com
    const highlightOptions = {
      animation: google.maps.Animation.DROP,
      icon: {
        path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
        fillColor: 'gold',
        fillOpacity: 1,
        scale: 0.5,
        strokeColor: 'red',
        strokeWeight: 2,
      },
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

  latLng(place) {
    return new google.maps.LatLng(place.lat, place.lon);
  }
}

module.exports = GoogleMap
