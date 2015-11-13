import React from 'react';

class FeedInput extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.props.newFeed);
  }

  handleChange() {
    this.props.onChange(
      this.refs.feedUriInput.value
    )
  }

  render() {
      return (
          <form onSubmit={this.handleSubmit}>
              <input
                  type="text"
                  placeholder="URI..."
                  value={this.props.newFeed.uri}
                  ref="feedUriInput"
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
