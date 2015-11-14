import _ from 'lodash';

// Create a map that represents a destination.
class DestinationMap {
  constructor(map) {
    this.map = map;
  }

  goToDestination(destination) {
    if(!destination || !destination.place) return;
    console.log('goToDestination', destination);
    this.focus(destination.place);
    this.nearBy(destination.nearByDestinations);
  }

  focus(place) {
    // add marker if it's a city with a the highlight color
    if (place.geo_level == 'city') {
      this.map.highlightMarker(place);
    }
    this.map.focus(place);
  }

  nearBy(places) {
    // add markers
    _.forEach(places, place => {
      this.map.marker(place);
    });
  }

}

module.exports = DestinationMap
