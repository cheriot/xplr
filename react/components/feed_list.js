import React from 'react/addons';
import { Link } from 'react-router';

class FeedList extends React.Component {
  constructor(props) {
    super(props);
  }

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
      <ul>
        {this.props.feeds.map((feed) => {
          return (
            <li key={feed.id}>
              {feed.name}
              &nbsp;
              <Link to={`/management/feeds/${feed.id}`}>edit</Link>
            </li>
          );
        })}
      </ul>
    );
  }
}

module.exports = FeedList;
