const express  = require('express');
const router = require('./app/routes/router');
const https = require('https');
const request = require('request');
const spotifyService = require('./app/services/spotify-services.js');
const querystring = require('querystring');
const display = require('./app/views/display')
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const app = express();


app.get('/login', function(req, res){
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
  '?response_type=code' +
  '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
  (scopes ? '&scope=' + encodeURIComponent('user-read-currently-playing') : '') +
  '&redirect_uri=' + encodeURIComponent('http://localhost:3000/callback'));
});

app.get('/callback', async function(req, res){
  console.log("calledback");
  let code = req.query.code;

  var options = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    form: {
      'grant_type': "authorization_code",
      'code' : code,
      'redirect_uri' : 'http://localhost:3000/callback'
    },
    headers: {
      'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencode'
    }
  };
  res.send(200);
  request.post(options, async (err, res, body) =>{
      console.log(`statusCode: ${res.statusCode}`)
      if(res.statusCode === 200 && !err){
        var access_token = JSON.parse(body).access_token;
        let refresh_token = JSON.parse(body).refresh_token;

        var meOptions = {
          uri: 'https://api.spotify.com/v1/me/player/currently-playing',
          headers: { 
            'Authorization': 'Bearer ' + access_token,
            'Content-Type': 'application/json',
            'Accept': 'application/json' },
          json: true
        };
        try{
          let albumOptions = await spotifyService.getCurrentListening(meOptions, res);
          let imageUrl = await spotifyService.getAlbumArtwork(albumOptions);
          (async(imageUrl) => {
            display.displayUrlImage(imageUrl);
          })(imageUrl);
          spotifyService.monitorCurrentlyPlaying(refresh_token);
        } catch(err){
          console.log(err);
          display.displayStaticImage('./static/default.png');
        }
      }
  });
});

app.listen(process.env.PORT, () => console.log(`Listening on Port ${process.env.PORT}`))
display.displayStaticImage('./static/default.png');``