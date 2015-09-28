import React from 'react/addons';
import FeedInput from './feed_input';
import FeedList from './feed_list';

class Root extends React.Component {
  render() {
    return (
      <div>
        Hello, World.
        <FeedInput />
        <FeedList />
      </div>
    );
  }
}

module.exports = Root;
