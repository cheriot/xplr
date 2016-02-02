import React from 'react';
import Helmet from 'react-helmet';
import reactMixin from 'react-mixin';
import {Link, History} from 'react-router';
import _ from 'lodash';

import {
  trackNavRelated,
  trackNavMap,
  trackOutboundFeedEntry
} from '../models/tracked_actions';
import DestinationActions from '../actions/destination_actions';
import DestinationStore from '../stores/destination_store';
import MapViewActions from '../actions/map_view_actions';
import MapViewStore from '../stores/map_view_store';
import LoadingIndicator from './loading_indicator';
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
    trackNavMap(place);
    this.history.pushState(null, place.uri);
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
    const placeName = maybe(this.state, 'place', 'name');

    // The map will only initialize once <MapView /> is on the page so make sure that
    // happens in every code path.

    return (
      <section className='component-destination-home'>
        <Helmet title={placeName} />

        <div className='container container-narrow card loading-container'>
          <h1 className='destination-name'>
            {placeName /* The &nbsp; sets the height until placeName has a value.*/ }
            &nbsp;
          </h1>
          <LoadingIndicator loading={this.state.loading} />
        </div>

        <MapView
          destination={this.state}
          onSelectDestination={this.handleDestinationSelect}
          onMapMove={this.handleMapMove} />

        <div className='container container-narrow card loading-container'>
          <LoadingIndicator loading={this.state.loading} hideIndicator={true} />
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

  renderListDestination(relatedDestination, index) {
    if (relatedDestination.feedEntries.length == 0) return;

    const navigationAnalytics = () => trackNavRelated(index);

    return (
      <div key={relatedDestination.place.id}>
        <h2>
          <Link
              to={relatedDestination.place.uri}
              onClick={navigationAnalytics}>
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

    // MapViewStore must control the node given to google maps since we reuse it
    // on subsequent pages.
    return (
      <div ref='mapWrapper' className='map-wrapper' />
    );
  }
}

class FeedEntryItem extends React.Component {

  render() {
    return (
      <li>
        <a className='feed-entry-title'
           target='_blank'
           href={this.props.feedEntry.uri}
           onClick={trackOutboundFeedEntry}>
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
