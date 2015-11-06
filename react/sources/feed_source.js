import agent from '../agent';

class FeedSource {
  fetch() {
    return agent.get('/feeds')
      .then(this.returnBody);
  }

  create(newFeed) {
    return agent.post('/feeds/create', {feed: newFeed})
      .then(this.returnBody);
  }

  destroy(id) {
    return agent.del(`/feeds/${id}`)
      .then(this.returnBody);
  }

  fetchById(id) {
    return agent.get(`/feeds/${id}`)
      .then(this.returnBody);
  }

  returnBody(response) {
    return response.body;
  }
};

module.exports = new FeedSource();
