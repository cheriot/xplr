import _ from 'lodash';

// Create a map that represents a destination.
class DestinationMap {
  constructor(map) {
    this.map = map;
    this.map.listen('idle', this.handleMovement);
  }

  goToDestination(destination, onSelectDestination) {
    if(!destination || !destination.place) return;
    if(this.destination && this.destination.place.id != destination.place.id) {
      this.map.reset();
    }

    this.destination = destination;
    this.nearBy(destination.markerPlaces, onSelectDestination);
    this.focus(destination);
  }

  setMovementListener(listener) {
    this.movementListener = listener;
  }

  handleMovement = (a, b, c) => {
    if (this.movementListener) {
      this.movementListener(this.map.getBounds());
    }
  }

  focus(destination) {
    // if this is a country
    //   zoom to the nearBy places that are within it
    // if this is a city
    //   zoom to it and the nearest three

    let closest = null;
    let addHighlightMarker = false;
    if (destination.place.isCity) {
      closest = _.take(destination.listDestinations.map(d => d.place), 3);
      addHighlightMarker = true;
    } else {
      const countryId = destination.place.country_id;
      closest = _(destination.listDestinations)
        .map(d => d.place)
        .filter(p => {
          return p.country_id == countryId;
        })
        .value();
      addHighlightMarker = false;
    }
    this.map.focus(destination.place, addHighlightMarker, closest);
  }

  nearBy(places, listener) {
    // add markers
    _.forEach(places, place => {
      const placeListener = () => listener(place);
      this.map.marker(place, {}, placeListener);
    });
  }

}

module.exports = DestinationMap
