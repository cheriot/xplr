import React from 'react/addons';
import { Link } from 'react-router';

class FeedList extends React.Component {

  render() {
    if (this.props.errorMessage) {
      return (
        <div>Something is wrong</div>
      );
    }

    if (this.props.isLoading) {
      return (
        <div>
          <img src="/ajax-loader.gif" />
        </div>
      )
    }

    return (
      <ul>{this.props.feeds.map(this.renderFeed)}</ul>
    );
  }

  renderFeed(feed) {
    return (
      <li key={feed.id}>
        {feed.uri}
        &nbsp;
        <Link to={`/management/feeds/${feed.id}`}>edit</Link>
      </li>
    );
  }
}

module.exports = FeedList;
