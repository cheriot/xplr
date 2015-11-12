import React from 'react/addons';

import DestinationActions from '../actions/destination_actions';
import DestinationStore from '../stores/destination_store';
import MapViewActions from '../actions/map_view_actions';

class DestinationHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = DestinationStore.getState();
    if (this.needFetch()) {
      DestinationActions.fetch(this.props.params.id);
    }
  }

  componentDidMount() {
    DestinationStore.listen(this.handleChange);
  }

  componentWillUnmount() {
    DestinationStore.unlisten(this.handleChange);
  }

  handleChange = (state) => {
    this.setState(state);
  }

  needFetch() {
    // allow 4 and '4'
    return !(this.state && this.state.place
       && this.state.place.id == this.props.params.id);
  }

  render() {
    if (!this.state || !this.state.place || !this.state.feedEntries) {
      return <p>We haven't yet found content here. Email cheriot@gmail.com if you find something that travelers should know about.</p>;
    }

    return (
      <section>
        <h1>{this.state.place.name}</h1>
        <MapView
            focusedPlace={this.state.place} />
        <ul>
          {this.state.feedEntries.map(this.renderEntry)}
        </ul>
      </section>
    );
  }

  renderEntry(feedEntry) {
    return <FeedEntryItem key={feedEntry.id} feedEntry={feedEntry} />
  }

}

class MapView extends React.Component {
  componentDidMount() {
    MapViewActions.mapConnect(this.refs.mapRoot.getDOMNode());
  }

  componentWillUnmount() {
    MapViewActions.mapDisconnect(this.refs.mapRoot.getDOMNode());
  }

  render() {
    const mapStyles = { height: '300px' };

    return (
      <div ref='mapRoot' id='map-canvas' style={mapStyles} />
    );
  }
}

class FeedEntryItem extends React.Component {
  render() {
    return (
      <li>
        <a target='_blank' href={this.props.feedEntry.source_id}>
          {this.props.feedEntry.title}
        </a>
      </li>
    );
  }
}

module.exports = DestinationHome
