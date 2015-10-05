//
// Large portions copied from
// https://github.com/danmactough/node-feedparser/blob/master/examples/iconv.js
//

import request from 'request';
import FeedParser from 'feedparser';
import { Iconv } from 'iconv';

class FeedReader {
  constructor(uri) {
    this.uri = uri;
    this.promise = null;
    this.originalCharset = null;
    this.posts = [];
    this.meta = null;
  }

  fetch() {
    if (!this.promise) {
      this.promise = this.fetchFromRemote();
    }
    return this.promise
  }

  fetchFromRemote() {
    this.promise = new Promise((resolve, reject) => {
      const req = request(this.uri, {timeout: 50000, pool: false});
      // Some feeds do not respond without user-agent and accept headers.
      req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
      req.setHeader('accept', 'text/html,application/xhtml+xml');

      const feedparser = new FeedParser();

      // reject promise on errors
      const onError = (error) => { reject(error) };
      req.on('error', onError);
      feedparser.on('error', onError);

      // preprocess response before working with posts
      req.on('response', (res) => {
        if (res.statusCode != 200) onError(new Error(`Bad status code ${res.statusCode}`));

        // try to ensure utf-8
        res = this.maybeTranslate(res, onError);

        // And boom goes the dynamite [edit: huh?]
        res.pipe(feedparser);
      });

      // read posts
      var reader = this;
      feedparser.on('readable', function() {
        let post;
        while (post = this.read()) {
          reader.posts.push(post);
        }
      });

      feedparser.on('meta', (meta) => {
        this.meta = meta;
      });

      feedparser.on('end', () => { resolve(this); });
    });
    return this.promise;
  }

  getParams(str) {
    // Turn key=val;key=val
    // into {key: val, key: val}
    return str.split(';').reduce((params, param) => {
      const parts = param.split('=').map((part) => { return part.trim(); });
      if (parts.length === 2) {
        params[parts[0]] = parts[1];
      }
      return params;
    }, {});
  }

  maybeTranslate(res, onError) {
    const charset = this.getParams(res.headers['content-type'] || '').charset;
    if (charset && !/utf-*8/i.test(charset)) {
      this.originalCharset = charset;
      // Use iconv if its not utf8 already.
      iconv = new Iconv(charset, 'utf-8');
      console.log('Converting from charset %s to utf-8', charset);
      iconv.on('error', onError);
      // If we're using iconv, stream will be the output of iconv
      // otherwise it will remain the output of request
      return res.pipe(iconv);
    }
    return res;
  }
}

module.exports = FeedReader;
