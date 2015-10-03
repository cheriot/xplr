import express from 'express';
import bodyParser from 'body-parser';
import React from 'react/addons';
import Router from 'react-router';
import routes from '../react/routes';


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

import Feed from '../server/models/feed';
app.get('/feeds', function(req, res) {
  var all = Feed.fetchAll().then((feedCollection) => {
    res.json(feedCollection.models);
  });
});

app.post('/feeds/create', (req, res) => {
  var newFeed = req.body.feed;
  Feed.forge(newFeed).save().then((feed) => {
    res.json(feed);
  });

});

app.get('*', function(req, res) {
  // Data api will always be application/json
  if(req.headers["content-type"] === "application/json") {
    res.json({
      "route": "Sorry this page does not exist!"
    });
  }

  // Anything that the data API doesn't handle is either a react-router url or a 404,
  // which react-router will handle.
  Router.run(routes, req.url, function(Handler, state) {
    var reactHtml = React.renderToString(<Handler {...state} />),
        clientSrcDomain = process.env.REACT_HOT == "hot" ? "http://localhost:5555" : "",
        clientSrc = `${clientSrcDomain}/client/bundle.js`;
    res.render('index.ejs', {reactHtml: reactHtml, clientSrc: clientSrc});
  });
});


app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
