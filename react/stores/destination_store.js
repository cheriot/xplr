import alt from '../alt_dispatcher';
import DestinationActions from '../actions/destination_actions';

class DestinationStore {

  constructor() {
    this.destinationPlace = null;
    this.bindListeners({
      handleUpdateDestination: DestinationActions.UPDATE_DESTINATION
    });
  }

  handleUpdateDestination(destination) {
    this.setState(destination);
  }

}

module.exports = alt.createStore(DestinationStore, 'DestinationStore');
