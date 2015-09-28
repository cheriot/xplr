import dispatcher from '../dispatcher';
import FeedSource from '../sources/feed_source';

class FeedActions {
  updateFeeds(feeds) {
    this.dispatch(feeds);
  }

  fetchFeeds() {
    // we dispatch an event here so we can have "loading" state.
    this.dispatch();
    FeedSource.fetch()
      .then((feeds) => {
        // we can access other actions within our action through `this.actions`
        this.actions.updateFeeds(feeds);
      })
      .catch((errorMessage) => {
        this.actions.feedsFailed(errorMessage);
      });
  }

  feedsFailed(errorMessage) {
    this.dispatch(errorMessage);
  }
}

module.exports = dispatcher.createActions(FeedActions);
