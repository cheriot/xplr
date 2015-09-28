import React from 'react/addons';
import FeedInput from './feed_input';
import FeedList from './feed_list';

var Root = React.createClass({
  render: function() {
    return (
      <div>
        Hello, World.
        <FeedInput />
        <FeedList />
      </div>
    );
  }
});

module.exports = Root;
