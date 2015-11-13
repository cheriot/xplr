import _, { isEmpty } from 'lodash';
import React from 'react';

import FeedEntryStore from '../stores/feed_entry_store';
import FeedEntryActions from '../actions/feed_entry_actions';
import GooglePlacesAutocomplete from './google_places_autocomplete';
import SafeText from './safe_text';

class EntryQueue extends React.Component {

  constructor(props) {
    super(props);
    this.state = FeedEntryStore.getState();

    this.handleChange = this.handleChange.bind(this);
    this.handleIgnore = this.handleIgnore.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handlePlaceRemove = this.handlePlaceRemove.bind(this);
  }

  handleChange(state) {
    this.setState(state);
  }

  handleIgnore(feedEntry) {
    FeedEntryActions.ignore(feedEntry);
  }

  handlePublish(feedEntry) {
    FeedEntryActions.publish(feedEntry);
  }

  handlePlaceSelect(feedEntry, googlePlace) {
    FeedEntryActions.selectPlace(feedEntry, googlePlace);
  }

  handlePlaceRemove(feedEntry, place) {
    FeedEntryActions.removePlace(feedEntry, place);
  }

  componentDidMount() {
    FeedEntryStore.listen(this.handleChange)
    FeedEntryActions.fetchFeedEntries();
  }

  componentWillUnmount() {
    FeedEntryStore.unlisten(this.handleChange)
  }

  render() {
    return (
      <FeedEntryList
        isLoading={this.state.loading == 'loading'}
        feedEntries={this.state.feedEntries}
        onIgnore={this.handleIgnore}
        onPublish={this.handlePublish}
        onPlaceSelect={this.handlePlaceSelect}
        onPlaceRemove={this.handlePlaceRemove} />
    );
  }

}

class FeedEntryList extends React.Component {

  styles() {
    return {
      listStyle: 'none'
    };
  }

  render() {
    if (this.props.errorMessage) {
      return <div>Something is wrong.</div>;
    }

    let loadingIndicator = null;
    if (this.props.isLoading) {
      loadingIndicator = (
        <div>
          <img src="/ajax-loader.gif" />
        </div>
      );
    }

    return (
      <ul style={this.styles()}>
        <li>{loadingIndicator}</li>
        {this.props.feedEntries.map(this.renderFeedEntry.bind(this))}
      </ul>
    );
  }

  renderFeedEntry(feedEntry, index) {
    return (
      <FeedEntryForm
          isFocus={index === 0}
          key={feedEntry.id}
          feedEntry={feedEntry}
          onIgnore={this.props.onIgnore}
          onPublish={this.props.onPublish}
          onPlaceSelect={this.props.onPlaceSelect}
          onPlaceRemove={this.props.onPlaceRemove} />
    );
  }
}

class FeedEntryForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleIgnore = this.handleIgnore.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handlePlaceRemove = this.handlePlaceRemove.bind(this);
  }

  handleIgnore(event) {
    event.preventDefault();
    this.props.onIgnore(this.props.feedEntry);
  }

  handlePublish(event) {
    event.preventDefault();
    this.props.onPublish(this.props.feedEntry);
  }

  handlePlaceSelect(googlePlace) {
    this.props.onPlaceSelect(this.props.feedEntry, googlePlace);
  }

  handlePlaceRemove(place) {
    this.props.onPlaceRemove(this.props.feedEntry, place);
  }

  styles() {
    return {
      marginBottom: '30px'
    };
  }

  render() {
    const feedEntry = this.props.feedEntry;

    // Putting the autocomplete inside the same form as publish triggers
    // a submit when the user selects from the autocomplete with the
    // keyboard.
    return (
      <li style={this.styles()}>

        <div>
          <a href={feedEntry.source_id} target='_blank'>
            <SafeText text={feedEntry.title} />
          </a>
          &lt;
          <a href={feedEntry.feed.uri} target='_blank'>{feedEntry.feed.title}</a>
        </div>

        <ul>
          {feedEntry.places.map(this.renderPlace)}
        </ul>

        <GooglePlacesAutocomplete
            onPlaceSelect={this.handlePlaceSelect}
            isFocus={this.props.isFocus} />

        <form>
          <button
              type='submit'
              onClick={this.handlePublish}
              disabled={isEmpty(feedEntry.places)}>
            publish
          </button>
          <button
              type='submit'
              onClick={this.handleIgnore}>
            ignore
          </button>
        </form>

      </li>
    );
  }

  renderPlace = (place) => {
    return (
      <PlaceForm
        key={place.id}
        place={place}
        onRemove={this.handlePlaceRemove} />
    );
  }
}

class PlaceForm extends React.Component {

  handleRemove = (event) => {
    event.preventDefault();
    this.props.onRemove(this.props.place);
  }

  render() {
    const deEmphasizedStyles = { color: 'lightgray' };
    const linkStyle = { textDecoration: 'none' };
    const place = this.props.place;

    return (
      <li>
        ({place.geo_level})
        {' '}
        {place.name}
        {' '}
        <span style={deEmphasizedStyles}>
          {place.formatted_address}
        </span>
        {' '}
        <a
            href
            onClick={this.handleRemove}
            style={linkStyle}>
          x
        </a>
      </li>
    );
  }
}

module.exports = EntryQueue;
