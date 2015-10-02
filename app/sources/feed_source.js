import agent from '../agent';

var mockData = [
  {name: "Foo", uri: "foo.com/rss"},
  {name: "Bar", uri: "bar.com/rss"}
];

class FeedSource {
  fetch() {
    return agent.get('/feeds').then( (response) => response.body );
  }

  create(newFeed) {
    return agent.post('/feeds/create', {feed: newFeed}).then( (response) => response.body );
  }
};

module.exports = new FeedSource();
