import dispatcher from '../dispatcher';
import FeedActions from '../actions/feed_actions';

class FeedStore {
  constructor() {
    this.feeds = [];
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateFeeds: FeedActions.UPDATE_FEEDS,
      handleFetchFeeds: FeedActions.FETCH_FEEDS,
      handleFeedsFailed: FeedActions.FEEDS_FAILED
    });
  }

  static newFeed() {
    return {name: '', uri: ''};
  }

  handleUpdateFeeds(feeds) {
    this.feeds = feeds;
    this.errorMessage = null;
  }

  handleFetchFeeds() {
    // reset the array while we're fetching new feeds so React can
    // be smart and render a spinner for us since the data is empty.
    this.feeds = [];
  }

  handleFeedsFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

module.exports = dispatcher.createStore(FeedStore, 'FeedStore');
