// Use es5 to tell babel to handle the es6 in other files.
require("babel/register")({
  stage: 0,
  plugins: ["typecheck"]
});

// Define isomorphic constants.
global.__CLIENT__ = false;
global.__SERVER__ = true;

// Actually start the server.
require('./app/initServer');
