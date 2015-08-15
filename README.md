uShip
=========

A uShip API wrapper for Node.js. See the API documentation at https://developer.uship.com/docs

**Installation**

```npm install uship```

**Testing**

Get an API key from your settings page: https://developer.uship.com/apps/mykeys. You may need to contact [api-support@uship.com](mailto:api-support@uship.com). See: https://developer.uship.com/docs.

Copy config.json.sample to config.json and update the file with your account settings.

```
npm i -g mocha
npm test
```

**Usage**

The module wraps the api and returns [when.js](https://github.com/cujojs/when "A solid, fast Promises/A+ and when() implementation, plus other async goodies.") promises.

```
var uShip = require("uship");
var uship = new uShip(API_KEY, API_SECRET);
var data = {
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
uship.estimate(data).then(function(result){
  console.log(JSON.stringify(result));
});

/*

Outputs: 

{
   "route":{
      "distance":{
         "kilometers":1445.1873,
         "label":"898 mi.",
         "shortLabel":"898 mi."
      },
      "items":[
         {
            "address":{
               "majorMunicipality":"Austin",
               "postalCode":"78704",
               "stateProvince":"TX",
               "stateProvinceLabel":"Texas",
               "country":"US",
               "countryLabel":"United States",
               "latitude":30.244144,
               "longitude":-97.76286,
               "label":"Austin, TX",
               "shortLabel":"Austin, TX"
            }
         },
         {
            "address":{
               "majorMunicipality":"Tucson",
               "postalCode":"85704",
               "stateProvince":"AZ",
               "stateProvinceLabel":"Arizona",
               "country":"US",
               "countryLabel":"United States",
               "latitude":32.32818,
               "longitude":-110.98608,
               "label":"Tucson, AZ",
               "shortLabel":"Tucson, AZ"
            }
         }
      ]
   },
   "price":{
      "value":631.21,
      "label":"$631.21",
      "shortLabel":"$632"
   }
}
*/

```
**Supported Methods**

Shipping Price Estimates ([API Documentation](https://developer.uship.com/docs/read/apis/oauth/Shipping_Price_Estimates))

 * uShip::estimate(data)

**Todo**

 * Other methods
 * Extend documentation

