import React from 'react/addons';
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
    console.log('handlePlaceSelect', feedEntry, googlePlace);
    FeedEntryActions.selectPlace(feedEntry, googlePlace);
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
        onPlaceSelect={this.handlePlaceSelect} />
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

    if (this.props.isLoading) {
      return (
        <div>
          <img src="/ajax-loader.gif" />
        </div>
      );
    }

    return (
      <ul style={this.styles()}>
        {this.props.feedEntries.map(this.renderFeedEntry.bind(this))}
      </ul>
    );
  }

  renderFeedEntry(feedEntry) {
    return (
      <FeedEntryForm
          key={feedEntry.id}
          feedEntry={feedEntry}
          onIgnore={this.props.onIgnore}
          onPublish={this.props.onPublish}
          onPlaceSelect={this.props.onPlaceSelect} />
    );
  }
}

class FeedEntryForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleIgnore = this.handleIgnore.bind(this);
    this.handlePublish = this.handlePublish.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
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

  styles() {
    return {
      marginBottom: '30px'
    };
  }

  render() {
    const feedEntry = this.props.feedEntry;

    return (
      <li style={this.styles()}>
        <form>

          <div>
            <a href={feedEntry.uri} target='_blank'>
              <SafeText text={feedEntry.title} />
            </a>
            &lt;
            <a href={feedEntry.feed.uri} target='_blank'>{feedEntry.feed.title}</a>
          </div>

          <div>
            {(feedEntry.places || []).length} places associated
          </div>

          <GooglePlacesAutocomplete
              onPlaceSelect={this.handlePlaceSelect} />

          <div>
            <button
                type='submit'
                onClick={this.handlePublish}
                disabled={!feedEntry.locations}>
              publish
            </button>
            <button
                type='submit'
                onClick={this.handleIgnore}>
              ignore
            </button>
          </div>
        </form>
      </li>
    );
  }
}

module.exports = EntryQueue;
