const http = require('http');
const request = require('request');
const display = require('../views/display');
const fetch = require('node-fetch');
const FormData = require('form-data');
const dotenv = require('dotenv')
dotenv.config();
const { URLSearchParams } = require('url');
function getSpotifyToken() {
    http.get()
}

async function getCurrentListening(meOptions){
    let response = await fetch(meOptions.uri, {
        headers: {
            'Authorization': meOptions.headers.Authorization,
            'Content-Type': 'application/json',
            'Accept': 'application/json' },
        });
        if(response.status === 200){
            let responseJson = await response.json();
            return {
                uri: responseJson.item.album.href,
                headers: meOptions.headers,
                json:true
            }
        }else{
            return response.status + ':' + response.statusText;
        }
}

async function getAlbumArtwork(albumOptions) {
    let response = await fetch(albumOptions.uri, {
        headers: albumOptions.headers
    });
    let jsonResponse = await response.json();
    return jsonResponse.images[0].url;
}

async function monitorCurrentlyPlaying(refreshToken){
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    // var formData = new FormData();
    // formData.append('grant_type', 'refresh_token');
    // formData.append('refresh_token', refreshToken);
    var params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken)
    options = {
        method: 'POST',
        body: params,
        headers: {
          'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
        }
    };
    let refreshResponse = await getRerfreshToken ('https://accounts.spotify.com/api/token', options);
    let newToken = await refreshResponse.access_token;
    var meOptions = {
        uri: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: { 
          'Authorization': 'Bearer ' + newToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json' },
        json: true
      };
      try{
        let albumOptions = await this.getCurrentListening(meOptions);
        let imageUrl = await this.getAlbumArtwork(albumOptions);
        (async(imageUrl) => {
          display.displayUrlImage(imageUrl);
        })(imageUrl);
        this.monitorCurrentlyPlaying(refreshToken);
      }catch(err){
          console.log(err);
          display.displayStaticImage('./static/default.png');
          this.monitorCurrentlyPlaying(refreshToken);
      }
}

async function getRerfreshToken(url, refreshOptions){

    let response = await fetch(url, refreshOptions);
    let refreshResponseJson = await response.json();
    return refreshResponseJson;
}

module.exports = {
    getCurrentListening,
    getAlbumArtwork,
    monitorCurrentlyPlaying,
    getRerfreshToken
}