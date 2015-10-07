import alt from '../alt_dispatcher';
import FeedActions from '../actions/feed_actions';

class FeedStore {
  constructor() {
    this.isLoading = false;
    this.feeds = [];
    this.currentFeed = null;
    this.errorMessage = null;

    this.bindListeners({
      handleUpdateCurrentFeed: FeedActions.CURRENT_FEED,
      handleUpdateFeeds: FeedActions.UPDATE_FEEDS,
      handleLoading: [FeedActions.FETCH_FEEDS, FeedActions.FETCH_FEED_BY_ID],
      handleFeedsFailed: FeedActions.FEEDS_FAILED
    });
  }

  static newFeed() {
    return {name: '', uri: ''};
  }

  handleUpdateCurrentFeed(feed) {
    this.isLoading = false;
    this.currentFeed = feed;
  }

  handleUpdateFeeds(feeds) {
    this.isLoading = false;
    this.feeds = feeds;
    this.errorMessage = null;
  }

  handleLoading() {
    this.isLoading = true;
  }

  handleFeedsFailed(errorMessage) {
    this.isLoading = false;
    this.errorMessage = errorMessage;
  }
}

module.exports = alt.createStore(FeedStore, 'FeedStore');
