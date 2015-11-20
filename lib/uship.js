var when = require("when");
var request = require("request");
var _ = require("underscore");
var S = require("string");
var OAuth2 = require('oauth').OAuth2;

// Error technique from
// http://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript
var uShipError = function () {
  var tmp = Error.apply(this, arguments);
  tmp.name = this.name = 'uShipError';
  this.stack = tmp.stack;
  this.message = tmp.message;
  return this;
}

var IntermediateInheritor = function () {}
IntermediateInheritor.prototype = Error.prototype;
uShipError.prototype = new IntermediateInheritor();

var uShip = function(key, secret, username, password){
  this.access_token = null;
  this.username = username || false;
  this.password = password || false;
  this.oauth2 = new OAuth2(
    key,
    secret,
    'https://api.uship.com',
    null,
    '/oauth/token',
    null
  );
}

uShip.prototype._getOAuthAccessToken = function(){
  var uship = this;

  return when.promise(function(resolve, reject){
    var options = {
        grant_type: 'client_credentials',
        username: uship.username,
        password: uship.password
      };

    uship.oauth2.getOAuthAccessToken('', options, function (error, access_token){
      if(error){
        var message;
        try {
          message = JSON.parse(error.data).error;
        } catch (err) {
          message = "Unable to get access token.";
        }
        return reject(new uShipError(message));
      }
      uship.access_token = access_token;
      resolve(access_token);
    });
  });
}

uShip.prototype.post = function(path, data, attempt){
  attempt = attempt || 1;
  var uship = this;
  return when.promise(function(resolve){
    if(uship.access_token) {
      resolve(uship.access_token);
    } else {
      resolve(uship._getOAuthAccessToken());
    }
  }).then(function(access_token){
    return when.promise(function(resolve, reject){
      var options = {
        method: "post",
        url: "https://api.uship.com" + path,
        headers: {
          Authorization: "Bearer " + access_token
        },
        json: true,
        body: data
      };
      request(options, function(error, response, body){
        if(error) {
          return reject(error);
        }

        var okResponseCodes = [200, 201];

        if(okResponseCodes.indexOf(response.statusCode) == -1) {
          if(response.headers['www-authenticate'] && response.headers['www-authenticate'].indexOf('invalid_token') !== -1 && attempt === 1) {
            uship.access_token = null;
            return resolve(uship.post(path, data, attempt + 1));
          }
          return reject(new uShipError(S(body).stripTags()));
        }

        if (response.headers.location != undefined) {
          return resolve(response.headers);
        } else {
          return resolve(body);
        }
      });
    });
  });
}

uShip.prototype.estimate = function(data) {
  return this.post("/v2/estimate", data);
}

uShip.prototype.rateRequest = function(data) {
  return this.post("/v2/rateRequests", data);
}

module.exports = uShip;
