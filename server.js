require("babel/register")({
  plugins: ["typecheck"]
});

var express = require('express'),
    path = require('path'),
    app = express(),
    port = 4444,
    React = require('react/addons'),
    ComponentRoot = React.createFactory(require('./app/components/root'));

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
  console.log(ComponentRoot({}));
  var reactHtml = React.renderToString(ComponentRoot({}));
  // Output html rendered by react
  console.log(reactHtml);
  res.render('index.ejs', {reactOutput: reactHtml});
});

//Route not found -- Set 404
app.get('*', function(req, res) {
  res.json({
    "route": "Sorry this page does not exist!"
  });
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
