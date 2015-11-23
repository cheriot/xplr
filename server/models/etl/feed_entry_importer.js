import Feed from '../feed';
import FeedReader from './feed_reader';
import EntryResource from '../../resources/entry_resource';

export function importFeedEntries() {
  return Feed
    .query('orderBy', 'name')
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
              return EntryResource.updateOrCreate(feed, post);
            };
            return Promise.all(reader.posts.map(importPost));
          });
      });

      return Promise.all(feedPromises);
    })
}
