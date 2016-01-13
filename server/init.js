require('newrelic');

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Router from 'react-router';

import routes from '../react/routes';
import alt from '../react/alt_dispatcher';
import Iso from 'iso';
import config from '../config';

process.on('unhandledRejection', function(error, promise) {
  console.error("UNHANDLED REJECTION", error.stack);
});

var app = express(),
    port = (process.env.PORT || 4444);

// Serve static assets (change before production!)
app.use(express.static(path.join(process.cwd(), "public")));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// SQL logger
app.use(require('knex-logger')(require('./models/knex')));

// Tell Express.js how to render index.ejs
app.set('views', __dirname);
app.set('view engine', 'ejs');

//
// Data API
//

import FeedResource from './resources/feed_resource';
import EntryResource from './resources/entry_resource';
import PlaceResource from './resources/place_resource';
import DestinationResource from './resources/destination_resource';

app.get('/feeds', (req, res) => {
  FeedResource.list(req)
    .then((feeds) => {
      res.json(feeds)
    });
});

app.post('/feeds/create', (req, res) => {
  FeedResource.create(req)
    .then((feed) => {
      res.json(feed);
    });
});

app.get('/feeds/:id', (req, res) => {
  FeedResource.get(req)
    .then( (feed) => {
      res.json(feed);
    });
});

app.delete('/feeds/:id', (req, res) => {
  FeedResource.destroy(req)
    .then(() => res.json({'deleted': true}) );
});

app.get('/entries', (req, res) => {
  EntryResource.queue()
    .then(entries => res.json(entries));
});

app.post('/entries/:id/ignore', (req, res) => {
  EntryResource.ignore(req)
    .then(() => res.json({ignored: true}) );
});

app.post('/entries/:id/publish', (req, res) => {
  const id = req.params.id;
  EntryResource.publish(id)
    .then(() => res.json({published: true}) );
});

app.post('/entries/:id/places/:placeId', (req, res) => {
  const feedEntryId = req.params.id,
        placeId = req.params.placeId;
  EntryResource.addPlace(feedEntryId, placeId)
    .then(feedEntry => res.json(feedEntry) );
});

app.delete('/entries/:feedEntryId/places/:placeId', (req, res) => {
  EntryResource.removePlace(req.params.feedEntryId, req.params.placeId)
    .then(feedEntry => res.json(feedEntry));
});

app.post('/places/', (req, res) => {
  PlaceResource.updateOrCreate(req.body)
    .then(place => res.json(place));
});

//
// Web Pages
//

app.get('/destinations/nearBy', (req, res) => {
  DestinationResource.fetch(req.query)
    .then(destination => res.json(destination));
});

app.get('/destinations/:placeId', (req, res) => {
  DestinationResource.fetchByPlace(req.params.placeId)
    .then(destination => {
      if(isApi(req)) {
        res.json(destination);
      } else if(isHtml(req)) {
        res.locals.data = {
          "DestinationStore": destination
        }
        reactRouteAndRender(req, res);
      } else {
        console.log('Error: unexpected accepts header', req.headers.accepts);
      }
    });
});

function isApi(req) { return /application\/json/.test(req.headers.accept); }
function isHtml(req) { return /text\/html/.test(req.headers.accept); }

function reactRouteAndRender(req, res) {

  // Anything that the data API doesn't handle is either a react-router url or a 404,
  // which react-router will handle (just not yet..).
  Router.run(routes, req.url, function(Handler, state) {
    // Connect data to alt's stores.
    alt.bootstrap(JSON.stringify(res.locals.data || {}));

    // Render HTML with all the data alt has been given.
    var reactHtml = ReactDOMServer.renderToString(<Handler {...state} />),
        clientSrcDomain = process.env.REACT_HOT == "hot" ? "http://localhost:5555" : "",
        clientSrc = `${clientSrcDomain}/client/bundle.js`,
        styleSrc = `${clientSrcDomain}/client/bundle.css`;

    // Use Iso to hand our data to alt on the client side.
    const iso = new Iso();
    iso.add(reactHtml, alt.flush());
    res.render('index.ejs', {
      reactHtml: iso.render(),
      clientSrc: clientSrc,
      styleSrc: styleSrc,
      googleKey: config.GOOGLE_KEY_CLIENT
    });
  });
}

app.get('*', function(req, res) {
  // 404s and react pages we don't prefetch data for.
  reactRouteAndRender(req, res);
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
