import React from 'react/addons';

import DestinationActions from '../actions/destination_actions';
import DestinationStore from '../stores/destination_store';

class DestinationHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = DestinationStore.getState();
    if (this.needFetch()) {
      DestinationActions.fetch(this.props.params.id);
    }
  }

  componentDidMount() {
    DestinationStore.listen(this.handleChange);
  }

  componentWillUnmount() {
    DestinationStore.unlisten(this.handleChange);
  }

  handleChange = (state) => {
    this.setState(state);
  }

  needFetch() {
    // allow 4 and '4'
    return !(this.state.destinationPlace
       && this.state.destinationPlace.id == this.props.params.id);
  }

  render() {
    if (!this.state.destinationPlace || !this.state.feedEntries) {
      return <p>We haven't yet found content here. Email cheriot@gmail.com if you find something that travelers should know about.</p>;
    }

    return (
      <section>
        <h1>{this.state.destinationPlace.name}</h1>
        <ul>
          {this.state.feedEntries.map(this.renderEntry)}
        </ul>
      </section>
    );
  }

  renderEntry(feedEntry) {
    return <FeedEntryItem key={feedEntry.id} feedEntry={feedEntry} />
  }

}

class FeedEntryItem extends React.Component {
  render() {
    return (
      <li>
        <a target='_blank' href={this.props.feedEntry.source_id}>
          {this.props.feedEntry.title}
        </a>
      </li>
    );
  }
}

module.exports = DestinationHome
