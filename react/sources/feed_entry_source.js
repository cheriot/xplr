import agent from '../agent';

class FeedEntrySource {
  fetch() {
    return agent.get('/entries').then((response) => {
      console.log('entries', response.body);
      return response.body;
    });
  }
}

module.exports = new FeedEntrySource();
