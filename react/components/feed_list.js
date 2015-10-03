import React from 'react/addons';

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

    if (!this.props.feeds.length) {
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
            <li>{feed.name}</li>
          );
        })}
      </ul>
    );
  }
}

module.exports = FeedList;
