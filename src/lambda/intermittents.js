const request = require('request');
const fs = require('fs');
const moment = require('moment');

const getUrl = (id, start, end) =>
  `https://treeherder.mozilla.org/api/failurecount/?bug=${id}&startday=${start}&endday=${end}&tree=all`;

async function fetchBug(bugId) {
  try {
    const beginning = moment()
      .subtract(7, 'days')
      .format('Y-M-D');
    const end = moment().format('Y-M-D');
    const url = getUrl(bugId, beginning, end);
    const resp = await new Promise(r =>
      request(url, { json: true }, (err, res, body) => r(body))
    );
    const count = resp.map(r => r.failure_count).reduce((s, i) => s + i, 0);
    return { bugId, count };
  } catch (e) {
    console.warn(e);
    return '';
  }
}

exports.handler = async function(event, context, callback) {
  const bugIds = event.queryStringParameters.bugs.split(',');
  const results = await Promise.all(bugIds.map(fetchBug));

  const intermittents = {};
  for (const r of results) {
    intermittents[r.bugId] = r.count;
  }
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(intermittents),
    contentType: 'text/json',
  });
};
