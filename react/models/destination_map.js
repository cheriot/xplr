import _ from 'lodash';

// Create a map that represents a destination.
class DestinationMap {
  constructor(map) {
    this.map = map;
    this.map.listen('idle', this.handleMovement);
    this.skipNextMovement = true;
  }

  goToDestination(destination, onSelectDestination) {
    if(!destination || !destination.place) return;
    if(this.destination && this.destination.place.id != destination.place.id) {
      this.map.reset();
    }
    this.destination = destination;
    this.nearBy(destination.nearByDestinations, onSelectDestination);
    this.focus(destination.place);
  }

  setMovementListener(listener) {
    this.movementListener = listener;
  }

  handleMovement = (a, b, c) => {
    if (this.skipNextMovement) {
      this.skipNextMovement = false;
    } else if (this.movementListener) {
      this.movementListener(this.map.getBounds());
    }
  }

  focus(place) {
    // add marker if it's a city with a the highlight color
    this.map.focus(place, place.geo_level == 'city');
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
