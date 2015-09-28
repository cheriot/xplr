require("babel/register")({
  stage: 0,
  plugins: ["typecheck"]
});

import express from 'express';
import path from 'path';
import React from 'react/addons';

var ComponentRoot = React.createFactory(require('./app/components/root'));
var app = express(),
    port = 4444;

// Define isomorphic constants.
global.__CLIENT__ = false;
global.__SERVER__ = true;

// Serve static assets (change before production!)
app.use(express.static("./public"));

// Show Express.js where to find index.ejs
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  // React.renderToString takes your component
  // and generates the markup
  var reactHtml = React.renderToString(ComponentRoot({})),
      clientSrcDomain = process.env.REACT_HOT == "hot" ? "http://localhost:5555" : "",
      clientSrc = `${clientSrcDomain}/client/bundle.js`
  res.render('index.ejs', {reactHtml: reactHtml, clientSrc: clientSrc});
});

//Route not found -- Set 404
app.get('*', function(req, res) {
  res.json({
    "route": "Sorry this page does not exist!"
  });
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
