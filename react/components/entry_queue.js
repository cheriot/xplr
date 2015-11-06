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
  }

  componentDidMount() {
    FeedEntryStore.listen(this.handleChange)
    FeedEntryActions.fetchFeedEntries();
  }

  componentWillUnmount() {
    FeedEntryStore.unlisten(this.handleChange)
  }

  handleChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <FeedEntryList
        isLoading={this.state.loading == 'loading'}
        feedEntries={this.state.feedEntries} />
    );
  }

}

class FeedEntryList extends React.Component {
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

    return <ul>{this.props.feedEntries.map(this.renderFeedEntry)}</ul>;
  }

  renderFeedEntry(feedEntry) {
    return (
      <li key={feedEntry.id}>
        <div>
          <a href={feedEntry.uri} target='_blank'>
            <SafeText text={feedEntry.title} />
          </a>
          &lt;
          <a href={feedEntry.feed.uri} target='_blank'>{feedEntry.feed.title}</a>
        </div>
        <GooglePlacesAutocomplete places={feedEntry.locations}/>
        <button type='submit' disabled={!feedEntry.locations}>publish</button>
        <button type='submit'>ignore</button>
      </li>
    );
  }
}

module.exports = EntryQueue;
