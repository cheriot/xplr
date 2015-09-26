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
            </form>
        );
    }
});

module.exports = FeedInput
