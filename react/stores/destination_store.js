import alt from '../alt_dispatcher';
import DestinationActions from '../actions/destination_actions';

class DestinationStore {

  constructor() {
    this.bindListeners({
      handleFetch: DestinationActions.FETCH,
      handleUpdateDestination: DestinationActions.UPDATE_DESTINATION
    });
  }

  handleFetch() {
    this.setState({loading: true});
  }

  handleUpdateDestination(destination) {
    this.setState(destination);
    this.setState({loading: false});
  }

}

module.exports = alt.createStore(DestinationStore, 'DestinationStore');
