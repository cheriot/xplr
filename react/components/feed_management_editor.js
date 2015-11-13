import React from 'react';
import reactMixin from 'react-mixin';
import { Navigation } from 'react-router';

import FeedStore from '../stores/feed_store';
import FeedActions from '../actions/feed_actions';

@reactMixin.decorate(Navigation)
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
      .then(() => { this.transitionTo('/management') });
  }

  render() {
    if(this.state.currentFeed) {
      var feedMarkup = (
        <div>
          <h1>Edit {this.state.currentFeed.title}</h1>
          <p>
            {this.state.currentFeed.uri}
          </p>
          <p>
            <form onSubmit={this.handleDelete}>
              <button type='submit'>delete</button>
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
