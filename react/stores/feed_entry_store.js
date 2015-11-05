import alt from '../alt_dispatcher';
import FeedEntryActions from '../actions/feed_entry_actions';

class FeedEntryStore {
  constructor() {
    this.loading = 'empty';
    this.feedEntries = [];

    this.bindListeners({
      handleUpdateFeedEntries: FeedEntryActions.UPDATE_FEED_ENTRIES,
      handleLoading: FeedEntryActions.FETCH_FEED_ENTRIES
    });
  }

  handleUpdateFeedEntries(feedEntries) {
    this.loading = 'loaded';
    this.feedEntries = feedEntries;
  }

  handleLoading() {
    this.loading = 'loading';
  }
}

module.exports = alt.createStore(FeedEntryStore, 'FeedEntryStore');
