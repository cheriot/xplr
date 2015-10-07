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
    return this.forgeById(req).fetch();
  }

  static destroy(req, res) {
    return this.forgeById(req).destroy();
  }

  static forgeById(req) {
    return Feed.forge({id: req.params.id});
  }
}

module.exports = FeedResource
