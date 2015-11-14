import React from 'react';
import reactMixin from 'react-mixin';
import { Navigation } from 'react-router';
import _ from 'lodash';

import DestinationActions from '../actions/destination_actions';
import DestinationStore from '../stores/destination_store';
import MapViewActions from '../actions/map_view_actions';
import MapViewStore from '../stores/map_view_store';

@reactMixin.decorate(Navigation)
class DestinationHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {feedEntries: []};
    this.fetchWhenNeeded(this.props);
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

  needFetch(props) {
    // allow 4 and '4'
    return !(this.state && this.state.place
       && this.state.place.id == props.params.id);
  }

  handleDestinationSelect = (place) => {
    this.transitionTo(`/destinations/${place.id}`);
  }

  handleMapMove = (bounds) => {
    console.log('map moved to', bounds);
    DestinationActions.fetchNearBy(bounds);
  }

  componentWillReceiveProps(newProps) {
    this.fetchWhenNeeded(newProps);
  }

  fetchWhenNeeded(props) {
    if (this.needFetch(props)) {
      console.log('need fetch', this.state, props);
      DestinationActions.fetch(props.params.id);
    }
  }

  render() {
    let message = '';
    if (this.state.place && _.isEmpty(this.state.feedEntries)) {
      message = <p>We haven't yet found content here. Email cheriot@gmail.com if you find something that travelers should know about.</p>;
    }

    // The map will only initialize once <MapView /> is on the page so make sure that
    // happens in every code path.
    return (
      <section>
        <h1>{this.state.place ? this.state.place.name : ''}</h1>
        <MapView
            destination={this.state}
            onSelectDestination={this.handleDestinationSelect}
            onMapMove={this.handleMapMove} />
        {message}
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
    MapViewStore.listen(this.handleChange);
    MapViewActions.mapConnect(this.refs.mapRoot);
  }

  componentWillUnmount() {
    MapViewStore.unlisten(this.handleChange);
    MapViewActions.mapDisconnect(this.refs.mapRoot);
  }

  handleChange = (state) => {
    this.setState(state);
  }

  handleMapMove = (bounds) => {
    if (this.props.onMapMove) this.props.onMapMove(bounds);
  }

  render() {
    if (this.state && this.state.map && this.props.destination) {
      this.state.map.goToDestination(this.props.destination, this.props.onSelectDestination);
      this.state.map.setMovementListener(this.handleMapMove);
    }

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
