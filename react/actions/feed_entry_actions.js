import alt from '../alt_dispatcher';
import FeedEntrySource from '../sources/feed_entry_source';

class FeedEntryActions {

  updateFeedEntries(feedEntries) {
    this.dispatch(feedEntries);
  }

  fetchFeedEntries() {
    this.dispatch();
    return FeedEntrySource.fetch()
      .then((feedEntries) => {
        this.actions.updateFeedEntries(feedEntries);
      });
  }
}

module.exports = alt.createActions(FeedEntryActions);
