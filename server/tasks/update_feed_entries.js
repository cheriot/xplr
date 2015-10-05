import Feed from '../models/feed';
import FeedReader from '../models/feed_reader';

let exitAfterPromise

Feed.query('orderBy', 'name')
  .fetchAll()
  .then((collection) => {
    const feedPromises = collection.models.map((feed) => {
      console.log(`read entries from ${feed.get('title')} at ${feed.get('uri')}`);

      return new FeedReader(feed.get('uri')).fetch()
        .then((reader) => {
          console.log(`updating ${reader.meta.title}`);
          reader.posts.forEach((post) => {
            console.log(`post: ${post.title} ${post.link}`);
          });
          console.log(`done with ${feed.get('uri')}`);
        })
    });
    return Promise.all(feedPromises);
  })
  .then(() => {
    process.exit();
  });
