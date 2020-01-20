const spotifyService = require('../services/spotify-services.js');
const request = require('request');
const display = require('../views/display')
const chalk = require('chalk');
var ip = require('ip');
module.exports = app => {
    app.get('/userData', async function(req, res, body){
        try {
          var userOptions = {
            uri: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: {
                'Authorization': 'Bearer ' + req.query.accessToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            json: true
        };
                let currentListening = await spotifyService.getCurrentListening(userOptions, res);
                albumOptions = currentListening.albumOptions;
                let imageUrl = await spotifyService.getAlbumArtwork(albumOptions);
                let artistList=[];
                currentListening.artist.forEach(artist => {
                  artistList.push(artist.name);
                })
                let spotifyData = {
                    albumName: currentListening.album,
                    artistName: artistList.join(),
                    imageUrl: imageUrl
                };
                // (async(imageUrl) => {
                //   display.displayUrlImage(imageUrl);
                // })(imageUrl);
                res.send(spotifyData)
              /*
                This logic is from before this code was an api. I am not ready to get rid of it. 
                  spotifyService.monitorCurrentlyPlaying(refresh_token);

              */
            }
            catch (err) {
                console.log(err);
                res.statusCode(500);
                display.displayStaticImage('./static/default.png');
            }
    })
}