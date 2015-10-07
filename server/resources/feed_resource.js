import Feed from '../models/feed';

class FeedResource {
  static list(req, res) {
    return Feed.fetchAll().then((feedCollection) => feedCollection.models);
  }

  static create(req, res) {
    var newFeed = req.body.feed;
    return Feed.forge(newFeed).save();
  }

  static get(req, res) {
    var id = req.params.id;
    return Feed.forge({id: id}).fetch();
  }
}

module.exports = FeedResource
