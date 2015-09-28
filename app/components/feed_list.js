import React from 'react/addons';
import FeedStore from '../stores/feed_store';
import FeedActions from '../actions/feed_actions';

var FeedList = React.createClass({
  getInitialState() {
    return FeedStore.getState();
  },

  componentDidMount() {
    FeedStore.listen(this.onChange)
    FeedActions.fetchFeeds();
  },

  componentWillUnmount() {
    FeedStore.unlisten(this.onChange)
  },

  onChange(state) {
    this.setState(state);
  },

  render() {
    if (this.state.errorMessage) {
      return (
        <div>Something is wrong</div>
      );
    }

    if (!this.state.feeds.length) {
      return (
        <div>
          <img src="/ajax-loader.gif" />
        </div>
      )
    }

    return (
      <ul>
        {this.state.feeds.map((feed) => {
          return (
            <li>{feed.name}</li>
          );
        })}
      </ul>
    );
  }
});

module.exports = FeedList;
