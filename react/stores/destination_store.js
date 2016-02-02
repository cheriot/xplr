import alt from '../alt_dispatcher';
import DestinationActions from '../actions/destination_actions';

class DestinationStore {

  constructor() {
    this.bindListeners({
      handleLoading: [DestinationActions.FETCH, DestinationActions.PREPARE_FETCH],
      handleUpdateDestination: DestinationActions.UPDATE_DESTINATION,
      handleDoneLoading: [DestinationActions.ERROR, DestinationActions.ARRIVED]
    });
  }

  handleLoading() {
    this.setState({loading: true});
  }

  handleDoneLoading() {
    this.setState({loading: false});
  }

  handleUpdateDestination(destination) {
    this.setState(destination);
    this.setState({loading: false});
  }

}

module.exports = alt.createStore(DestinationStore, 'DestinationStore');
