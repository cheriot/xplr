import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import React from 'react/addons';

var Root = React.createFactory(require('./components/root'));
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
  // React.renderToString takes your component
  // and generates the markup
  var reactHtml = React.renderToString(Root({})),
      clientSrcDomain = process.env.REACT_HOT == "hot" ? "http://localhost:5555" : "",
      clientSrc = `${clientSrcDomain}/client/bundle.js`
  res.render('index.ejs', {reactHtml: reactHtml, clientSrc: clientSrc});
});

// Feeds mocks
var mockData = [
  {name: "Foo", uri: "foo.com/rss"},
  {name: "Bar", uri: "bar.com/rss"}
];

app.get('/feeds', function(req, res) {
  res.json(mockData);
});

app.post('/feeds/create', (req, res) => {
  var newFeed = req.body.feed;
  mockData.push(newFeed);
  res.json(newFeed);
});

//Route not found -- Set 404
app.get('*', function(req, res) {
  res.json({
    "route": "Sorry this page does not exist!"
  });
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
