import React from 'react';
import reactMixin from 'react-mixin';
import { History } from 'react-router';

import FeedStore from '../stores/feed_store';
import FeedActions from '../actions/feed_actions';

@reactMixin.decorate(History)
class FeedManagementEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = FeedStore.getState();
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    FeedStore.listen(this.handleChange);
    FeedActions.fetchFeedById(this.props.params.id);
  }

  componentWillUnmount() {
    FeedStore.unlisten(this.handleChange);
  }

  handleChange(state) {
    this.setState(state);
  }

  handleDelete(event) {
    event.preventDefault();
    FeedActions.destroyFeed(this.state.currentFeed)
      .then(() => { this.history.pushState(null, '/management/feeds') });
  }

  render() {
    if(this.state.currentFeed) {
      var feedMarkup = (
        <div className='container container-narrow'>
          <h1>Edit {this.state.currentFeed.title}</h1>
          <p>
            {this.state.currentFeed.uri}
          </p>
          <p>
            <form onSubmit={this.handleDelete}>
              <button type='submit' disabled={this.state.currentFeed.is_ignored}>
                ignore
              </button>
            </form>
          </p>
        </div>
      );
    }
    return (
      <div>
        {feedMarkup}
      </div>
    );
  }
}

module.exports = FeedManagementEditor;
