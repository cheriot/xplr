import React from 'react/addons';
import FeedManagement from './feed_management';

class Root extends React.Component {
  render() {
    return (
      <div>
        Hello, World.
        <FeedManagement />
      </div>
    );
  }
}

module.exports = Root;
