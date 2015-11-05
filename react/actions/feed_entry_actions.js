import alt from '../alt_dispatcher';
import FeedEntrySource from '../sources/feed_entry_source';

class FeedEntryActions {

  updateFeedEntries(feedEntries) {
    this.dispatch(feedEntries);
  }

  fetchFeedEntries() {
    console.log('fetchFeedEntries go');
    this.dispatch();
    return FeedEntrySource.fetch()
      .then((feedEntries) => {
        this.actions.updateFeedEntries(feedEntries);
      })
      .catch((errorMessage) => {
        console.error('fetchFeedEntries', errorMessage);
      });
  }
}

module.exports = alt.createActions(FeedEntryActions);
