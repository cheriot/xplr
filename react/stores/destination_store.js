import alt from '../alt_dispatcher';
import DestinationActions from '../actions/destination_actions';

class DestinationStore {

  constructor() {
    this.bindListeners({
      handleFetch: [DestinationActions.FETCH, DestinationActions.PREPARE_FETCH],
      handleUpdateDestination: DestinationActions.UPDATE_DESTINATION,
      handleError: DestinationActions.ERROR
    });
  }

  handleFetch() {
    this.setState({loading: true});
  }

  handleError() {
    this.setState({loading: false});
  }

  handleUpdateDestination(destination) {
    this.setState(destination);
    this.setState({loading: false});
  }

}

module.exports = alt.createStore(DestinationStore, 'DestinationStore');
