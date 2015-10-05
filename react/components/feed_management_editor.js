import React from 'react/addons';
import FeedStore from '../stores/feed_store';
import FeedActions from '../actions/feed_actions';

class FeedManagementEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = FeedStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    FeedStore.listen(this.onChange);
    FeedActions.fetchFeedById(this.props.params.id);
  }

  componentWillUnmount() {
    FeedStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    if(this.state.currentFeed) {
      var feedMarkup = (
        <div>
          <h1>Edit {this.state.currentFeed.title}</h1>
          <p>
            {this.state.currentFeed.uri}
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
