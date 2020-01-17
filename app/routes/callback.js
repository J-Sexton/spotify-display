const spotifyService = require('../services/spotify-services.js');
const request = require('request');
const display = require('../views/display')
const chalk = require('chalk');
var ip = require('ip');

module.exports = app => {
    app.get('/callback', async function(req, res){
        let code = req.query.code;
          console.log(chalk.bgGreen.bold(`GETTING DATA ON WHAT YOU ARE CURRENTLY LISTENING TO`));
          var options = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'POST',
            form: {
              'grant_type': "authorization_code",
              'code' : code,
              'redirect_uri' : `http://${ip.address()}:3000/callback`
            },
            headers: {
              'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencode'
            }
          };
          (async (response) => {
              request.post(options, async (err, res, body) => {
                  console.log(`statusCode: ${res.statusCode}`);
                  if (res.statusCode === 200 && !err) {
                      var access_token = JSON.parse(body).access_token;
                      let refresh_token = JSON.parse(body).refresh_token;
                      var userOptions = {
                          uri: 'https://api.spotify.com/v1/me/player/currently-playing',
                          headers: {
                              'Authorization': 'Bearer ' + access_token,
                              'Content-Type': 'application/json',
                              'Accept': 'application/json'
                          },
                          json: true
                      };
                      try {
                          let currentListening = await spotifyService.getCurrentListening(userOptions, res);
                          albumOptions = currentListening.albumOptions;
                          let imageUrl = await spotifyService.getAlbumArtwork(albumOptions);
                          let spotifyData = {
                              albumName: currentListening.albumName,
                              artistName: currentListening.artistName,
                              imageUrl: imageUrl,
                              refreshToken: refresh_token
                          };
                          (async(imageUrl) => {
                            display.displayUrlImage(imageUrl);
                          })(imageUrl);
                          response.send(spotifyData)
                        /*
                          This logic is from before this code was an api. I am not ready to get rid of it. 
                            spotifyService.monitorCurrentlyPlaying(refresh_token);

                        */
                      }
                      catch (err) {
                          console.log(err);
                          res.statusCode(500);
                          display.displayStaticImage('./static/default.png');
                          spotifyService.monitorCurrentlyPlaying(refresh_token);
                      }
                  }
              });
          })(res);
      });
}