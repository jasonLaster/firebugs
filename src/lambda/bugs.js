const request = require('request');
const fs = require('fs');
const csv = require('csvtojson');

const url = `https://bugzilla.mozilla.org/buglist.cgi?classification=Client%20Software&classification=Developer%20Infrastructure&classification=Components&classification=Server%20Software&classification=Other&columnlist=alias%2Cbug_id%2Cproduct%2Ccomponent%2Cassigned_to%2Cbug_status%2Cresolution%2Cshort_desc%2Cchangeddate%2Cpriority%2Ccf_backlog%2Cblocked%2Cdependson%2Cstatus_whiteboard%2Ckeywords%2Cbug_type&&component=Debugger&limit=0&list_id=14700748&priority=P1&priority=P2&priority=P3&priority=P4&priority=P5&priority=--&product=DevTools&query_format=advanced&resolution=---&human=1&ctype=csv`;

async function getResults() {
  try {
    const resp = await new Promise(r =>
      request(url, { json: true }, (err, res, body) => r(body))
    );
    const data = await csv({ noheader: true, output: 'csv' }).fromString(resp);
    const json = JSON.stringify(data);
    return json;
  } catch (e) {
    console.warn(e);
    return '';
  }
}

exports.handler = async function(event, context, callback) {
  const results = await getResults();
  callback(null, { statusCode: 200, body: results });
};
