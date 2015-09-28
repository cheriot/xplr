import React from 'react/addons';

var FeedInput = React.createClass({
    handleChange: function() {
      console.log('feed input changed');
    },
    render: function() {
        return (
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.props.filterText}
                    ref="filterTextInput"
                    onChange={this.handleChange}
                />
                <input
                    type="submit"
                    value="Add Feed"
                />
            </form>
        );
    }
});

module.exports = FeedInput