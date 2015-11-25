import _ from 'lodash';
import temp from 'temp';
temp.track();
import fs from 'fs';
import easyimage from 'easyimage';

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
    .get('http://localhost:3000/thumbnails/new')
    .query({url: uri})
    .then(res => res.body);
}

function generateThumbnail(summary) {
  // {src, size[x,y], type}
  const image = _.first(summary.images);
  return agent
    .get(image.src)
    .then(res => {
      const originalSize = res.body.length;

      const {path: imagePath, fd: imageFd} = temp.openSync('summary-full');
      fs.writeSync(imageFd, res.body, 0, res.body.length);
      fs.closeSync(imageFd);

      const convertedPath = temp.path({prefix: 'converted', suffix: '.jpg'});
      const thumbnailPath = temp.path('summary-thumbnail');

      return easyimage.convert({ src: imagePath, dst: convertedPath })
        .then(() => {
          return easyimage.thumbnail({
            src: convertedPath,
            dst: thumbnailPath,
            width: 300,
            quality: 50,
          })
        })
        .then(() => {
          // store in base64
          const thumbnailData = fs.readFileSync(thumbnailPath);
          console.log('thumbnail size', thumbnailData.length, thumbnailData.length/originalSize*100, '% of original')
          summary.thumbnail_uri = image.src;
          summary.thumbnail = thumbnailData.toString('base64');
          // clean up all the temp files
          temp.cleanupSync();
          return summary;
        });

    });
}

function summarize(feedEntry) {
  const uri = feedEntry.bestUri();
  console.log('summarize', feedEntry.get('id'), feedEntry.get('title'), uri);
  return fetchSummary(uri)
    .then(generateThumbnail)
    .then(summary => {
      // maybe persist: feed.favicon, video thumbnail
      feedEntry.set({
        summary_title: summary.title,
        summary_description: summary.description,
        summary_thumbnail: summary.thumbnail,
        summary_thumbnail_uri: summary.thumbnail_uri,
        summarized_at: new Date(),
      });
      return feedEntry.save();
    })
    .catch(err => {
      console.log('ERROR', err);
      // throw err;
      console.log('continue..');
      return Promise.all([]);
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

// * https://github.com/gottfrois/link_thumbnailer
// * http://link-thumbnailer-demo.herokuapp.com/
// * https://tech.shareaholic.com/2012/11/02/how-to-find-the-image-that-best-respresents-a-web-page/
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
