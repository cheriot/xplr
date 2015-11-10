import alt from '../alt_dispatcher';
import DestinationSource from '../sources/destination_source';

class DestinationActions {

  constructor() {
    this.generateActions('updateDestination');
  }

  fetch(placeId) {
    return DestinationSource.fetch(placeId)
      .then( destination => this.actions.updateDestination(destination) );
  }

}

module.exports = alt.createActions(DestinationActions)
