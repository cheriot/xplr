import React from 'react';
import reactMixin from 'react-mixin';
import {Link, Navigation} from 'react-router';
import _ from 'lodash';

import DestinationActions from '../actions/destination_actions';
import DestinationStore from '../stores/destination_store';
import MapViewActions from '../actions/map_view_actions';
import MapViewStore from '../stores/map_view_store';
import NavigationAutocomplete from './navigation_autocomplete';

import {maybe} from '../models/maybe';

@reactMixin.decorate(Navigation)
class DestinationHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = _.assign({
        feedEntries: [],
        listDestinations: [],
      },
      DestinationStore.getState()
    );
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
    DestinationActions.fetchNearBy(bounds);
  }

  componentWillReceiveProps(newProps) {
    this.fetchWhenNeeded(newProps);
  }

  fetchWhenNeeded(props) {
    if (this.needFetch(props)) {
      DestinationActions.fetch(props.params.id);
    }
  }

  render() {
    let message = '';
    if (this.state.place && _.isEmpty(this.state.feedEntries)) {
      message = <p>We haven't yet found content here. Email cheriot@gmail.com if you find something that travelers should know about.</p>;
    }

    const country = maybe(this.state, 'country');

    // The map will only initialize once <MapView /> is on the page so make sure that
    // happens in every code path.
    return (
      <section className='component-destination-home'>
        <div className='container container-narrow'>
          <NavigationAutocomplete />
          <h1>{maybe(this.state, 'place', 'name')}</h1>
        </div>

        <MapView
            destination={this.state}
            onSelectDestination={this.handleDestinationSelect}
            onMapMove={this.handleMapMove} />

        <div className='container container-narrow'>
          {message}
          <ul className='feed-entry-list'>
            {this.state.feedEntries.map(this.renderEntry)}
          </ul>
          {this.state.listDestinations.map(this.renderListDestination.bind(this))}
        </div>
      </section>
    );
  }

  renderEntry(feedEntry) {
    return <FeedEntryItem key={feedEntry.id} feedEntry={feedEntry} />
  }

  renderListDestination(relatedDestination) {
    if (relatedDestination.feedEntries.length == 0) return;
    return (
      <div key={relatedDestination.place.id}>
        <h2>
          <Link to={`/destinations/${relatedDestination.place.id}`}>
            {relatedDestination.place.name}
          </Link>
        </h2>
        <ul className='feed-entry-list'>
          {relatedDestination.feedEntries.map(this.renderEntry)}
        </ul>
      </div>
    );
  }

}

class MapView extends React.Component {

  componentDidMount() {
    MapViewStore.listen(this.handleChange);
    MapViewActions.mapConnect(this.refs.mapRoot);
  }

  componentWillUnmount() {
    console.log('destroying maps dom node');
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

    // Always render the same thing since google maps is created around
    // this dom node.
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
        <a target='_blank' href={this.props.feedEntry.uri}>
          <img src={this.props.feedEntry.thumbnail_data_uri} />
          {this.props.feedEntry.title}
        </a>
        <br />
        {this.props.feedEntry.summary_description}
      </li>
    );
  }
}

module.exports = DestinationHome
