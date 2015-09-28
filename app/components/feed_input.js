import React from 'react/addons';

class FeedInput extends React.Component {
    handleChange() {
      console.log('feed input changed');
    }

    handleSubmit(event) {
      console.log('feed submitted')
      event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Name..."
                    value={this.props.feedName}
                    ref="filterTextInput"
                    onChange={this.handleChange}
                />
                <input
                    type="text"
                    placeholder="URI..."
                    value={this.props.feedUri}
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
}

module.exports = FeedInput
