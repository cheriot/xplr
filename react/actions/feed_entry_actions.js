import alt from '../alt_dispatcher';
import FeedEntrySource from '../sources/feed_entry_source';

class FeedEntryActions {

  updateFeedEntries(feedEntries) {
    this.dispatch(feedEntries);
  }

  ignore(feedEntry) {
    console.log('now ignore', feedEntry);
    return FeedEntrySource
      .ignore(feedEntry)
      .then(() => this.actions.fetchFeedEntries());
  }

  publish(feedEntry) {
    console.log('now publish', feedEntry);
    return FeedEntrySource
      .publish(feedEntry)
      .then(() => this.actions.fetchFeedEntries());
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
