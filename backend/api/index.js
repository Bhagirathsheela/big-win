/*  run-lottery and this index.js and vercel.json 
 are created to deploy the backend in vercel remove them
  if you deploy backend somewhere else */

  const serverlessExpress = require("@vendia/serverless-express");
  const app = require("../app"); // or "./app" if app.js is in the same dir

  exports.handler = serverlessExpress({ app });
