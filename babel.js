// Use es5 to tell babel to handle the es6 in other files.
require("babel/register")({
  stage: 0,
  plugins: ["typecheck"]
});
