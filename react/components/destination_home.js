import React from 'react';
import reactMixin from 'react-mixin';
import {Link, History} from 'react-router';
import _ from 'lodash';
import ga from 'react-ga';

import DestinationActions from '../actions/destination_actions';
import DestinationStore from '../stores/destination_store';
import MapViewActions from '../actions/map_view_actions';
import MapViewStore from '../stores/map_view_store';

import {maybe} from '../models/maybe';

@reactMixin.decorate(History)
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
    this.history.pushState(null, `/destinations/${place.id}`);
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
    // The map will only initialize once <MapView /> is on the page so make sure that
    // happens in every code path.

    return (
      <section className='component-destination-home'>
        <div className='container container-narrow card-top'>
          <h1>{maybe(this.state, 'place', 'name')}</h1>
        </div>

        <MapView
          destination={this.state}
          onSelectDestination={this.handleDestinationSelect}
          onMapMove={this.handleMapMove} />

        <div className='container container-narrow card-bottom'>
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
    MapViewActions.mapConnect(this.refs.mapWrapper);
  }

  componentWillUnmount() {
    MapViewStore.unlisten(this.handleChange);
    MapViewActions.mapDisconnect(this.refs.mapWrapper);
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
    return (
      <div ref='mapWrapper' className='map-wrapper' />
    );
  }
}

class FeedEntryItem extends React.Component {
  trackOutboundLink = () => {
    ga.outboundLink({label: 'Outbound Feed Entry'}, () => {});
  }

  render() {
    return (
      <li>
        <a target='_blank' href={this.props.feedEntry.uri} onClick={this.trackOutboundLink}>
          {this.renderThumbnail()}
          {this.props.feedEntry.title}
        </a>
        <br />
        {this.props.feedEntry.summary_description}
      </li>
    );
  }

  renderThumbnail() {
    if(this.props.feedEntry.thumbnail_data_uri) {
      return <img src={this.props.feedEntry.thumbnail_data_uri} />
    } else {
      return <img src='http://www.fillmurray.com/g/150/150' />
    }
  }
}

module.exports = DestinationHome
