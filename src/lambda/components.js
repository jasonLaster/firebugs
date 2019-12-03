const request = require('request');

const getUrl = (searchText) =>
    `https://bugzilla.mozilla.org/rest/prod_comp_search/find/${searchText}?limit=101`;

async function getResults(searchText) {
    const url = getUrl(searchText);
    try {
        const resp = await new Promise(r =>
            request(url, { json: true }, (err, res, body) => r(body))
        );
        const json = JSON.stringify(resp);
        return json;
    } catch (e) {
        console.warn(e);
        return '';
    }
}

exports.handler = async function (event, context, callback) {
    const searchText = event.queryStringParameters.searchText;
    const results = await getResults(searchText);
    callback(null, {
        statusCode: 200,
        body: JSON.stringify(results),
        contentType: 'text/json',
    });
};