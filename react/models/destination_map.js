import _ from 'lodash';
import {maybe} from './maybe'
import {trackMapDrag, trackMapZoom} from './tracked_actions'

class DestinationMap {
  constructor(map) {
    this.map = map;
    this.map.listen('idle', this.handleMovement);
    this.mapTracker = new MapTracker(this.map);
  }

  clean() {
    this.map.clean();
  }

  goToDestination(destination, onSelectDestination) {
    if(!destination || !destination.place) return;
    if(this.destination && this.destination.place.id != destination.place.id) {
      console.log(
        `goTo ${destination.place.name} from ${maybe(this.destination, 'place', 'name')}`
      );
      this.mapTracker.destinationChanged();
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
    this.mapTracker.idle();
    const bounds = this.map.getBounds();
    if (this.movementListener && bounds) {
      this.movementListener(this.map.getBounds());
    }
  }

  focus(destination) {
    let closest = null;
    let markerDisplayType = null;

    if (destination.place.isCity) {
      closest = _.take(destination.listDestinations.map(d => d.place), 3);
      markerDisplayType = 'highlight';
    } else {
      const countryId = destination.place.country_id;
      closest = _(destination.listDestinations)
        .map(d => d.place)
        .filter(p => {
          return p.country_id == countryId;
        })
        .value();
      markerDisplayType = 'none';
    }

    this.map.focus(destination.place, markerDisplayType, closest);
  }

  nearBy(place, places, listener) {
    // add markers
    _.forEach(places, p => {
      const placeListener = () => listener(p);

      if (place.isCountry && p.country_id == place.id) {
        this.map.highlightMarker(p, placeListener);
      } else {
        this.map.marker(p, 'standard', placeListener);
      }
    });
  }

}


class MapTracker {
  constructor(map) {
    this.map = map;
    this.listening = false;
    this.listeners = [];
  }

  idle() {
    if (this.listeners.length > 0) return;
    this.addListener('dragend', trackMapDrag);
    this.addListener('zoom_changed', trackMapZoom);
  }

  destinationChanged() {
    this.removeListeners();
  }

  addListener(eventName, listener) {
    this.listeners.push(
      this.map.listen(eventName, listener)
    );
  }

  removeListeners() {
    _.each(this.listeners, (listener) => this.map.unlisten(listener));
    this.listeners.length = 0;
  }
}

module.exports = DestinationMap
