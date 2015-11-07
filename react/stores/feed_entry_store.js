import alt from '../alt_dispatcher';
import FeedEntryActions from '../actions/feed_entry_actions';

class FeedEntryStore {
  constructor() {
    this.loading = 'empty';
    this.feedEntries = [];

    this.bindListeners({
      handleUpdateFeedEntries: FeedEntryActions.UPDATE_FEED_ENTRIES,
      handleUpdateFeedEntry: FeedEntryActions.UPDATE_FEED_ENTRY,
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

  handleUpdateFeedEntry(feedEntry) {
    const i = this.feedEntries.map((fe) => fe.id).indexOf(feedEntry.id);
    this.feedEntries[i] = feedEntry;
  }
}

module.exports = alt.createStore(FeedEntryStore, 'FeedEntryStore');
