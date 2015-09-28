import React from 'react/addons';
import FeedStore from '../stores/feed_store';
import FeedActions from '../actions/feed_actions';

class FeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = FeedStore.getState();
  }

  componentDidMount() {
    FeedStore.listen(this.onChange.bind(this))
    FeedActions.fetchFeeds();
  }

  componentWillUnmount() {
    FeedStore.unlisten(this.onChange(this))
  }

  onChange(state) {
    this.state = state;
  }

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
}

module.exports = FeedList;
