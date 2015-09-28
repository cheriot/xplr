require("babel/register")({
  stage: 0,
  plugins: ["typecheck"]
});

// Define isomorphic constants.
global.__CLIENT__ = false;
global.__SERVER__ = true;

require('./app/initServer');
