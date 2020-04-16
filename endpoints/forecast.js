const request = require("request-promise");

const API_URL = `https://api.darksky.net/forecast/5c865bb2c117431125f6b159bf68e49b`;

let { CORS_WHITELIST } = process.env;
console.log(`CORS_WHITELIST (line 6): ${CORS_WHITELIST}`);
if (CORS_WHITELIST) {
  CORS_WHITELIST = CORS_WHITELIST.replace(/ /g, "").split(",");
}

const getResponseHeaders = request => {
  const headers = {
    "content-type": "application/json"
  };
  const { origin } = request.headers;
  console.log(`origin: ${origin}`);
  console.log(`CORS_WHITELIST: ${CORS_WHITELIST}`);
  if (origin && (!CORS_WHITELIST || CORS_WHITELIST.includes(origin))) {
    headers["Access-Control-Allow-Origin"] = "https://carltonhenderson.github.io";
  }
  return headers;
};

exports.handler = (event, context, callback) => {
  const qs = event.queryStringParameters;
  const { lat, lon } = qs;
  if (!lat || !lon) {
    callback("You must provide a latitude and longitude");
    return;
  }

  const url = `${API_URL}/${lat},${lon}`;
  // Remove lat and lon parameters, they go in the URL
  delete qs.lat;
  delete qs.lon;

  const options = {
    qs,
    json: true
  };      
  
  heads = getResponseHeaders(event);
  console.log(`heads: ${heads}`);
  console.log(`url: ${API_URL}/${lat},${lon}`);

  request(url, options)
    .then(response => {

      callback(null, {
        body: JSON.stringify(response),
        statusCode: 200,
        headers: getResponseHeaders(event)
      });
    })
    .catch(error => {
      callback(error);
    });
};
