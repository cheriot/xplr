// Application's facade around the google maps API

class GoogleMap {
  constructor(gMap) {
    this.gMap = gMap;
    this.reset();

    this.highlightOptions = {
      animation: google.maps.Animation.DROP,
      icon: {
        path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
        fillColor: 'gold',
        fillOpacity: 1,
        scale: 0.5,
        strokeColor: 'red',
        strokeWeight: 2,
      },
    };

    this.normalOptions = {
        map: this.gMap,
        icon: {
          path: 'M24-8c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h32c4.4 0 8 3.6 8 8v32z',
          fillColor: 'red',
          fillOpacity: 1,
          scale: 0.2,
          strokeColor: 'white',
          strokeWeight: 2
        },
      };
  }

  reset() {
    this.initialFocusSet = false;
    _.forEach(this.markers || [], marker => marker.setMap(null) );
    this.markers = [];
    this.idMarkers = {};
  }

  focus(place, addHighlightMarker, closest) {
    if(!this.initialFocusSet) {
      this.initialFocusSet = true;
      if (addHighlightMarker) {
          console.log('quick highlight', place.name);
          this.highlightMarker(place);
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
    if (this.hasMarker(place)) return;

    const markerOptions = _.assign(
      {},
      this.normalOptions,
      {
        position: {lat: place.lat, lng: place.lon},
        title: place.name,
      },
      options,
    );
    const marker = new google.maps.Marker(markerOptions);
    if (listener) marker.addListener('click', listener);
    this.recordMarker(place, marker);
  }

  highlightMarker(place, listener) {
    // the previous marker my not have been highlighted so remove it
    if (this.isHighlighted(place)) {
      return;
    }
    if (this.hasMarker(place)) {
      this.clearMarker(place);
    }

    // http://map-icons.com for svg path
    this.marker(place, this.highlightOptions, listener);
  }

  listen(eventName, listener) {
    google.maps.event.addListener(this.gMap, eventName, listener);
  }

  clearMarker(place) {
    this.idMarkers[place.id].setMap(null);
    delete this.idMarkers[place.id];
  }

  hasMarker(place) {
    return this.idMarkers[place.id]
  }

  isHighlighted(place) {
    const marker = this.hasMarker(place);
    return marker && marker.getIcon().fillColor == this.highlightOptions.icon.fillColor;
  }

  recordMarker(place, marker) {
    this.idMarkers[place.id] = marker;
    this.markers.push(marker);
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
