import alt from '../alt_dispatcher';
import DestinationSource from '../sources/destination_source';

class DestinationActions {

  constructor() {
    this.generateActions('updateDestination');
  }

  prepareFetch() {
    // The user has selected a destination and #fetch will be called once
    // the placeId is known.
    this.dispatch();
  }

  fetch(placeId) {
    this.dispatch();
    return DestinationSource.fetch(placeId)
      .then(destination => this.actions.updateDestination(destination));
  }

  error(message) {
    this.dispatch(message);
  }

  fetchNearBy(bounds) {
    return DestinationSource.fetchNearBy(bounds)
      .then(destination => this.actions.updateDestination(destination));
  }

}

module.exports = alt.createActions(DestinationActions)
