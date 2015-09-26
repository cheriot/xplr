import React from 'react/addons';
import FeedInput from './feed_input';

var Root = React.createClass({
  render: function() {
    return (
      <div>
        Hello, World.
        <FeedInput />
      </div>
    );
  }
});

module.exports = Root;
