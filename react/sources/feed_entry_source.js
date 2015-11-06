import agent from '../agent';

class FeedEntrySource {
  fetch() {
    return agent.get('/entries').then((response) => {
      return response.body;
    });
  }

  ignore(feedEntry) {
    return agent.post(`/entries/${feedEntry.id}/ignore`).then(this.returnBody);
  }

  publish(feedEntry) {
    return agent.post(`/entries/${feedEntry.id}/publish`, feedEntry).then(this.returnBody);
  }

  returnBody(response) {
    return response.body;
  }
}

module.exports = new FeedEntrySource();
