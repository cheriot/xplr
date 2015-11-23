import _ from 'lodash';
import {maybe} from '../models/maybe'

// Create a map that represents a destination.
class DestinationMap {
  constructor(map) {
    this.map = map;
    this.map.listen('idle', this.handleMovement);
  }

  goToDestination(destination, onSelectDestination) {
    if(!destination || !destination.place) return;
    console.log('goTo', destination.place.name, 'from', maybe(this.destination, 'place', 'name'));
    if(this.destination && this.destination.place.id != destination.place.id) {
      this.map.reset();
    }
    this.destination = destination;

    this.nearBy(destination.place, destination.markerPlaces, onSelectDestination);
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

  nearBy(place, places, listener) {
    // add markers
    _.forEach(places, p => {
      const placeListener = () => listener(p);

      if (place.isCountry && p.country_id == place.id) {
        this.map.highlightMarker(p, placeListener);
      } else {
        this.map.marker(p, {}, placeListener);
      }
    });
  }

}

module.exports = DestinationMap
