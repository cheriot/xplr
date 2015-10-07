import express from 'express';
import bodyParser from 'body-parser';
import React from 'react/addons';
import Router from 'react-router';
import routes from '../react/routes';
import alt from '../react/alt_dispatcher';
import Iso from 'iso';


var app = express(),
    port = 4444;

// Serve static assets (change before production!)
app.use(express.static("./public"));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Show Express.js where to find index.ejs
app.set('views', __dirname);
app.set('view engine', 'ejs');

//
// Data API
//
import FeedResource from '../server/resources/feed_resource';
app.get('/feeds', function(req, res) {
  FeedResource.list(req, res)
    .then((feeds) => {
      res.json(feeds)
    });
});

app.post('/feeds/create', (req, res) => {
  FeedResource.create(req, res)
    .then((feed) => {
      res.json(feed);
    });
});

app.get('/feeds/:id', (req, res) => {
  FeedResource.get(req, res)
    .then( (feed) => {
      res.json(feed);
    });
});

//
// Web Pages
//

function isApi(req) { return /application\/json/.test(req.headers.accept); }
function isHtml(req) { return /text\/html/.test(req.headers.accept); }

app.get('/management', function(req, res) {
  const list = FeedResource.list(req, res)
  if(isApi(req)) {
      list.then((feeds) => {
        res.json(feeds)
      });
  } else if(isHtml(req)) {
    list.then((feeds) => {
      res.locals.data = {
        "FeedStore": {
          "feeds": feeds,
          "isLoading": false,
          "currentFeed": null
        }
      }
      reactRouteAndRender(req, res);
    });
  } else {
    console.log('Error: unexpected accepts header', req.headers.accepts);
  }
});

function reactRouteAndRender(req, res) {
  // Data api will always be application/json
  if(req.headers["content-type"] === "application/json") {
    res.json({
      "route": "There has been an error routing your request."
    });
  }

  // Anything that the data API doesn't handle is either a react-router url or a 404,
  // which react-router will handle.
  Router.run(routes, req.url, function(Handler, state) {
    // Connect data to alt's stores.
    alt.bootstrap(JSON.stringify(res.locals.data || {}));

    // Render HTML with all the data alt has been given.
    var reactHtml = React.renderToString(<Handler {...state} />),
        clientSrcDomain = process.env.REACT_HOT == "hot" ? "http://localhost:5555" : "",
        clientSrc = `${clientSrcDomain}/client/bundle.js`;

    // Use Iso to hand our data to alt on the client side.
    const iso = new Iso();
    iso.add(reactHtml, alt.flush());
    res.render('index.ejs', {reactHtml: iso.render(), clientSrc: clientSrc});
  });
}

app.get('*', function(req, res) {
  // 404s and react pages we don't prefetch data for.
  reactRouteAndRender(req, res);
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
