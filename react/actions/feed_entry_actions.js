import alt from '../alt_dispatcher';
import FeedEntrySource from '../sources/feed_entry_source';

class FeedEntryActions {

  updateFeedEntries(feedEntries) {
    this.dispatch(feedEntries);
  }

  updateFeedEntry(feedEntry) {
    this.dispatch(feedEntry);
  }

  ignore(feedEntry) {
    return FeedEntrySource
      .ignore(feedEntry)
      .then(() => this.actions.fetchFeedEntries());
  }

  publish(feedEntry) {
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

  selectPlace(feedEntry, googlePlace) {
    this.dispatch();
    return FeedEntrySource
      .selectPlace(feedEntry, googlePlace)
      .then((feedEntry) => this.actions.updateFeedEntry(feedEntry));
  }

  removePlace(feedEntry, place) {
    this.dispatch();
    return FeedEntrySource
      .removePlace(feedEntry, place)
      .then((feedEntry) => this.actions.updateFeedEntry(feedEntry));
  }
}

module.exports = alt.createActions(FeedEntryActions);
