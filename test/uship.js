var assert = require('assert');
var config = require("../config.json");
var uShip = require("../lib/uship.js");

describe('uShip Account', function () {

  this.timeout(20000);

  it('should get an access token.', function (done) {

    var uship_valid = new uShip(config.uship_api_key, config.uship_api_secret);
    var uship_invalid = new uShip("INVALID", "INVALID");

    uship_valid._getOAuthAccessToken().then(function(){

      return uship_invalid._getOAuthAccessToken();

    }).done(function(){

      throw Error("Was able to get access token with invalid credentials.");

    }, function(e){

      assert.equal(e.message, "invalid_client");
      done();

    });
  });

  it('should get an estimate.', function(done){

    var route = {
      route: {
        items: [
          {
            address: {
              postalCode: "78704",
              country: "US"
            }
          },
          {
            address: {
              postalCode: "85704",
              country: "US"
            }
          }
        ]
      },
      items: [
        {
          commodity: "CarsLightTrucks",
          year: "1998",
          makeName: "Ford",
          modelName: "Ranger"
        }
      ]
    };


    var uship_valid = new uShip(config.uship_api_key, config.uship_api_secret);
    var uship_invalid = new uShip("INVALID", "INVALID");

    uship_valid.estimate(route).then(function(result){

      assert(result.price);
      return uship_invalid.estimate(route);

    }).done(function(){

      throw Error("Was able to get access token with invalid credentials.");

    }, function(e){

      assert.equal(e.message, "invalid_client");
      done();

    });
  })

  it('should create a rate request.', function(done) {
    var shipmentDetails = {
      route: {
        items: [
          {
            address: {
              postalCode: "78703",
              country: "US"
            },
            timeFrame: {
              earliestArrival: "2015/07/07",
              latestArrival: "2015/07/07",
              timeFrameType: "on"
            }
          },
          {
            address: {
              postalCode: "78653",
              country: "US"
            },
            timeFrame: {
              earliestArrival: "2015/07/10",
              latestArrival: "2015/07/10",
              timeFrameType: "on"
            }
          }
        ]
      },
      items: [
        {
          commodity: "CarsLightTrucks",
          year: "2011",
          makeName: "Ford",
          modelName: "Escape",
          unitCount: 1,
          isRunning: true,
          isConvertible: true,
          isModified: true
        }
      ],
      thirdPartyId: ""
    }

    var uship_valid = new uShip(config.uship_api_key, config.uship_api_secret);
    var uship_invalid = new uShip("INVALID", "INVALID");

    uship_valid.rateRequest(shipmentDetails).then(function(result){

      assert(result.price);
      return uship_invalid.rateRequest(shipmentDetails);

    }).done(function(){

      throw Error("Was able to get access token with invalid credentials.");

    }, function(e){

      assert.equal(e.message, "invalid_client");
      done();

    });

  })

});
