import Feed from '../models/feed';
import FeedEntry from '../models/feed_entry';
import FeedReader from '../models/feed_reader';

Feed.query('orderBy', 'name')
  .fetchAll()
  .then((collection) => {
    const feedPromises = collection.models.map((feed) => {
      console.log(`Starting to update feed ${feed.get('title')} at ${feed.get('uri')}`);

      return new FeedReader(feed.get('uri')).fetch()
        .then((reader) => {
          feed.updateOrInitializeFromRemote(reader.meta);
          return Promise.all([reader, feed.save()]);
        }).then(([reader, feed]) => {
          const importPost = (post) => {
            return FeedEntry.findOrCreateFromRemote(feed, post);
          };
          return Promise.all(reader.posts.map(importPost));
        });
    });
    return Promise.all(feedPromises);
  })
  .then(() => {
    process.exit();
  });
