var ip = require('ip');

module.exports = app => {
    app.get('/login', function(req, res){
        var scopes = 'user-read-private user-read-email';
        res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + process.env.SPOTIFY_CLIENT_ID +
      (scopes ? '&scope=' + encodeURIComponent('user-read-currently-playing') : '') +
      '&redirect_uri=' + encodeURIComponent(`http://localhost:3001/callback`));
    });
}