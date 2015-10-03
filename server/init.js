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

app.get('/', function(req, res) {
  Router.run(routes, req.url, function(Handler, state) {
    var routeFactory = React.createFactory(Handler)({...state});
    // React.renderToString takes your component
    // and generates the markup
    var reactHtml = React.renderToString(routeFactory),
        clientSrcDomain = process.env.REACT_HOT == "hot" ? "http://localhost:5555" : "",
        clientSrc = `${clientSrcDomain}/client/bundle.js`;
    res.render('index.ejs', {reactHtml: reactHtml, clientSrc: clientSrc});
  });
});

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

//Route not found -- Set 404
app.get('*', function(req, res) {
  res.json({
    "route": "Sorry this page does not exist!"
  });
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
