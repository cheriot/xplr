import dispatcher from '../dispatcher';
import FeedSource from '../sources/feed_source';

class FeedActions {
  updateFeeds(feeds) {
    this.dispatch(feeds);
  }

  currentFeed(feed) {
    this.dispatch(feed);
  }

  createFeed(newFeed) {
    FeedSource.create(newFeed)
      .then((feed) => {
        this.actions.fetchFeeds();
      })
      .catch((errorMessage) => {
        this.actions.createFailed(errorMessage);
      });
  }

  fetchFeeds() {
    this.dispatch(); // trigger loading state

    FeedSource.fetch()
      .then((feeds) => {
        // we can access other actions within our action through `this.actions`
        this.actions.updateFeeds(feeds);
      })
      .catch((errorMessage) => {
        this.actions.feedsFailed(errorMessage);
      });
  }

  fetchFeedById(id) {
    this.dispatch(); // trigger loading state

    FeedSource.fetchById(id)
      .then((feed) => {
        this.actions.currentFeed(feed);
      })
      .catch((errorMessage) => {
        // reuse the error handling for list and entity requests
        this.actions.feedsFailed(errorMessage);
      });
  }

  feedsFailed(errorMessage) {
    this.dispatch(errorMessage);
  }
}

module.exports = dispatcher.createActions(FeedActions);
