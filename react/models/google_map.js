// Application's facade around the google maps API

class GoogleMap {
  constructor(gMap) {
    this.gMap = gMap;
    this.markerDesigner = new MarkerDesigner();
    this.reset();
  }

  reset() {
    this.initialFocusSet = false;
    _.forEach(this.markers || [], marker => marker.setMap(null) );
    this.markers = [];
    this.idMarkers = {};
  }

  clean() {
    this.reset();
    google.maps.event.clearInstanceListeners(this.gMap);
  }

  focus(place, markerDisplayType, closest) {
    if(!this.initialFocusSet) {
      this.initialFocusSet = true;
      if (markerDisplayType != 'none') {
        // TODO: create the right kind of marker
        this.highlightMarker(place, this.temporaryBounce);
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
    if (this.gMap.getBounds()) {
      // A map is already shown, avoid jarring changes by moving as little as possible.
      console.log('new bounds', bounds, place.name, closest.map(c => c.name));
      this.gMap.fitBounds(bounds);
      this.gMap.panToBounds(bounds);
    } else {
      this.gMap.fitBounds(bounds);
    }
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

  marker(place, markerDisplayType, listener) {
    if (this.hasMarker(place)) return;

    const markerOptions = _.assign(
      {},
      {
        map: this.gMap,
        position: {lat: place.lat, lng: place.lon},
        title: place.name,
      },
      this.markerDesigner.create(markerDisplayType, place),
    );

    const marker = new google.maps.Marker(markerOptions);

    if (listener) marker.addListener('click', () => listener(marker, place));
    this.recordMarker(place, marker);
  }

  highlightMarker(place, listener) {
    const marker = this.hasMarker(place);

    if (this.markerDesigner.isHighlighted(marker)) return;

    if (marker) {
      // the previous marker was not highlighted so remove it
      this.clearMarker(place);
    }

    this.marker(place, 'highlight', listener);
  }

  listen(eventName, listener) {
    return google.maps.event.addListener(this.gMap, eventName, listener);
  }

  unlisten(listenerResult) {
    // listenerResult: returned from listen()
    google.maps.event.removeListener(listenerResult);
  }

  clearMarker(place) {
    this.idMarkers[place.id].setMap(null);
    delete this.idMarkers[place.id];
  }

  hasMarker(place) {
    return this.idMarkers[place.id]
  }

  recordMarker(place, marker) {
    this.idMarkers[place.id] = marker;
    this.markers.push(marker);
  }

  getBounds() {
    const bounds = this.gMap.getBounds();
    // There have been undefined bounds returned for unknown reasons.
    if (!bounds) return;
    return {
      viewport_lat_north: bounds.getNorthEast().lat(),
      viewport_lat_south: bounds.getSouthWest().lat(),
      viewport_lon_east: bounds.getNorthEast().lng(),
      viewport_lon_west: bounds.getSouthWest().lng()
    }
  }

  temporaryBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 500);
  }

  latLng(place) {
    return new google.maps.LatLng(place.lat, place.lon);
  }
}

class MarkerDesigner {
  // Generate google map's marker options.
  // http://map-icons.com for svg path

  constructor() {

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

    this.standardOptions = {
      icon: {
        path: 'M24-8c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h32c4.4 0 8 3.6 8 8v32z',
        fillColor: 'red',
        fillOpacity: 1,
        scale: 0.2,
        strokeColor: 'white',
        strokeWeight: 2
      },
    }
  }

  highlight(place) {
    return this.highlightOptions;
  }

  standard(place) {
    return this.standardOptions;
  }

  isHighlighted(marker) {
    return marker && marker.getIcon().path == this.highlightOptions.icon.path;
  }

  create(markerDisplayType, place) {
    if(['highlight', 'standard'].indexOf(markerDisplayType) == -1) {
      throw new Error(`Unexpected markerDisplayType ${markerDisplayType}`);
    }

    return this[markerDisplayType](place);
  }

}

module.exports = GoogleMap
