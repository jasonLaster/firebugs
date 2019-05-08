import { fetchedResults } from './results';
import { isMeta } from './index';
const offline = false;

function createData(
  BugID,
  Alias,
  Product,
  Component,
  Assignee,
  Status,
  Resolution,
  Summary,
  Changed,
  Priority,
  backlog,
  Blocks,
  DependsOn,
  Whiteboard,
  Keywords
) {
  return {
    BugID,
    Alias,
    Product,
    Component,
    Assignee,
    Status,
    Resolution,
    Summary,
    Changed,
    Priority,
    backlog,
    Blocks,
    DependsOn,
    Whiteboard,
    Keywords,
  };
}

function saveData(results) {
  localStorage.setItem('results', JSON.stringify(results));
  localStorage.setItem('updated', Date.now());

  return results;
}

async function fetchData() {
  if (offline) {
    return fetchedResults;
  } else {
    let results = await (await fetch('.netlify/functions/bugs')).json();
    results.shift();
    results = results.map(row => createData(...row));
    return results;
  }
}

function parse(localData) {
  try {
    return JSON.parse(localData);
  } catch (e) {
    localStorage.clear();
    return {};
  }
}

function formatResults(results) {
  const bugs = {};

  const metas = {};
  for (const result of results) {
    if (isMeta(result)) {
      metas[result.BugID] = result;
    }
  }

  for (const result of results) {
    bugs[result.BugID] = result;
  }

  for (const result of results) {
    result.Metas = result.Blocks.split(', ')
      .map(id => bugs[id])
      .filter(i => i);
  }

  window.results = results;
  window.bugs = bugs;
  return { bugs, results };
}

export async function getBugs() {
  let localData = await localStorage.getItem('results');
  const results = localData ? parse(localData) : [];
  const fetched = fetchData()
    .then(saveData)
    .then(formatResults);

  return { fetched, ...formatResults(results) };
}
