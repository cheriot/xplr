import agent from '../agent';

class FeedSource {
  fetch() {
    return agent.get('/feeds')
      .then( (response) => response.body );
  }

  create(newFeed) {
    return agent.post('/feeds/create', {feed: newFeed})
      .then( (response) => response.body );
  }

  fetchById(id) {
    return agent.get(`/feeds/${id}`)
      .then ( (response) => response.body );
  }
};

module.exports = new FeedSource();
