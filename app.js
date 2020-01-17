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
const dotenv = require('dotenv')
var ip = require('ip');
const chalk = require('chalk');
dotenv.config();

const app = express();

authRouter(app);
callBack(app);

app.listen(process.env.PORT);
display.displayStaticImage('./static/default.png').then(() => {
  console.log(chalk.bgGreen.black.bold.underline(`TO SET UP GO TO: http://${ip.address()}:${process.env.PORT}/login ON A DEVICE ON THE SAME NETWORK`));
})
