import React from 'react/addons';
import FeedStore from '../stores/feed_store';
import FeedActions from '../actions/feed_actions';
import FeedInput from './feed_input';
import FeedList from './feed_list';

class FeedManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = FeedStore.getState();
    // Should FeedStore keep this as state? What's the lifecycle
    // of an Alt Store?
    // 'init' or 'bootstrap' handler?
    this.state.newFeed = FeedStore.newFeed();

    this.handleChangeFeed = this.handleChangeFeed.bind(this);
    this.handleCreateFeed = this.handleCreateFeed.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    FeedStore.listen(this.handleChange)
    FeedActions.fetchFeeds();
  }

  componentWillUnmount() {
    FeedStore.unlisten(this.handleChange)
  }

  handleChange(state) {
    this.setState(state);
  }

  handleCreateFeed(newFeed) {
    FeedActions
      .createFeed(newFeed)
      .then(() => { this.state.newFeed = FeedStore.newFeed(); });
  }

  handleChangeFeed(uri) {
    this.setState({newFeed: {uri: uri}});
  }

  render() {
    return (
      <div>
        <FeedInput
          newFeed={this.state.newFeed}
          onChange={this.handleChangeFeed}
          onSubmit={this.handleCreateFeed} />
        <FeedList
          feeds={this.state.feeds}
          isLoading={this.state.isLoading}
          errorMessage={this.state.errorMessage} />
      </div>
    );
  }
}

module.exports = FeedManagement;
