import React from 'react/addons';
import FeedStore from '../stores/feed_store';
import FeedActions from '../actions/feed_actions';
import FeedInput from './feed_input';
import FeedList from './feed_list';

class FeedManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = FeedStore.getState();
    this.state.newFeed = FeedStore.newFeed();

    this.handleChangeFeed = this.handleChangeFeed.bind(this);
    this.handleCreateFeed = this.handleCreateFeed.bind(this);
  }

  componentDidMount() {
    FeedStore.listen(this.onChange.bind(this))
    FeedActions.fetchFeeds();
  }

  componentWillUnmount() {
    FeedStore.unlisten(this.onChange(this))
  }

  onChange(state) {
    this.setState(state);
  }

  handleCreateFeed(newFeed) {
    console.log('createFeed', newFeed);
  }

  handleChangeFeed(name, uri) {
    this.setState({newFeed: {name: name, uri: uri}});
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
          errorMessage={this.state.errorMessage} />
      </div>
    );
  }
}

module.exports = FeedManagement;
