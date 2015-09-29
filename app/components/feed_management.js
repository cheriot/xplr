import React from 'react/addons';
import FeedStore from '../stores/feed_store';
import FeedActions from '../actions/feed_actions';
import FeedInput from './feed_input';
import FeedList from './feed_list';

class FeedManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = FeedStore.getState();
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

  render() {
    return (
      <div>
        <FeedInput
          feed={this.state.newFeed} />
        <FeedList
          feeds={this.state.feeds}
          errorMessage={this.state.errorMessage} />
      </div>
    );
  }
}

module.exports = FeedManagement;
