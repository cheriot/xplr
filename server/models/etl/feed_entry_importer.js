import _ from 'lodash';
import agent from '../../../react/sources/agent';
import Feed from '../feed';
import FeedEntry from '../feed_entry';
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

function fetchSummary(uri) {
  return agent
    .get('http://link-thumbnailer-api.herokuapp.com/thumbnails/new')
    .query({url: uri})
    .then(res => res.body);
}

function generateThumbnail(summary) {
  // {src, size[x,y], type}
  const image = _.first(summary.images);
  console.log('generateThumbnail of', image);
  return agent
    .get(image.src)
    .then(res => res.body.toString('base64'))
    .then(thumbnail => {
      summary.thumbnail = thumbnail;
      return summary;
    });
}

function summarize(feedEntry) {
  const uri = feedEntry.get('uri');
  console.log('summarize', feedEntry.get('id'), feedEntry.get('title'), uri);
  return fetchSummary(uri)
    .then(generateThumbnail)
    .then(summary => {
      // maybe persist: feed.favicon, video thumbnail
      feedEntry.set({
        summary_title: summary.title,
        summary_description: summary.description,
        summary_thumbnail: summary.thumbnail,
      });
      return feedEntry.save();
    })
    .catch(err => {
      console.log('ERROR', err);
      console.log('continue..');
      return Promise.all([]);
      //throw err;
    });
}

function promiseInSequence(array, func) {
  const first = _.first(array);
  const remaining = _.rest(array);
  const promise = Promise.resolve(null).then(() => func(first));

  return _.reduce(
    remaining,
    (p, element) => p.then(() => func(element)),
    promise
  );
}

export function summarizeFeedEntries(force=false) {
  const all = FeedEntry.where('published_state', 'in', ['published', 'queued']);
  const summarizable = force ? all : all.where({summarized_at: null})
  return summarizable
    .fetchAll()
    .then(collection => collection.models)
    .then(feedEntries => {
      return promiseInSequence(feedEntries, summarize);
    });
}
