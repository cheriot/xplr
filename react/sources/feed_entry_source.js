import agent from '../agent';

class FeedEntrySource {
  fetch() {
    return agent.get('/entries').then((response) => {
      return response.body;
    });
  }
}

module.exports = new FeedEntrySource();
