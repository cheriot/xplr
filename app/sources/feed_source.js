var mockData = [
  {name: "Foo", uri: "foo.com/rss"},
  {name: "Bar", uri: "bar.com/rss"}
];

class FeedSource {
  fetch() {
    // returning a Promise because that is what fetch does.
    return new Promise((resolve, reject) => {
      // simulate an asynchronous action where data is fetched on
      // a remote server somewhere.
      setTimeout( () => {
        // resolve with some mock data
        resolve(mockData);
      }, 250);
    });
  }

  create(newFeed) {
    mockData.push(newFeed);
    return new Promise((resolve, reject) => {
      setTimeout( () => {
        resolve(JSON.parse(JSON.stringify(newFeed)));
      }, 250);
    });
  }
};

module.exports = new FeedSource();
