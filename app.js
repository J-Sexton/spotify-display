const express  = require('express');
const router = require('./app/routes/router');
const https = require('https');
const request = require('request');
const spotifyService = require('./app/services/spotify-services.js');
const querystring = require('querystring');
const display = require('./app/views/display')
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const authRouter = require('./app/routes/authenticate');
const callBack = require('./app/routes/callback')
const spotifyData = require('./app/routes/spotifyData');
const dotenv = require('dotenv')
var ip = require('ip');
const chalk = require('chalk');
dotenv.config();

const app = express();

authRouter(app);
callBack(app);
spotifyData(app);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Methods', "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorize");
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
    } else {
      next();
    }});


app.listen(process.env.PORT);
display.displayStaticImage('./static/default.png').then(() => {
  console.log(chalk.bgGreen.black.bold.underline(`TO SET UP GO TO: http://${ip.address()}:${process.env.PORT}/login ON A DEVICE ON THE SAME NETWORK`));
})
