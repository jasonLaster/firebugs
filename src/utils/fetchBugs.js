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
  Keywords,
  Type
) {
  if (Assignee == 'nobody') {
    Assignee = null;
  }

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
    Type,
  };
}

function saveData(results) {
  localStorage.setItem('results', JSON.stringify(results));
  localStorage.setItem('updated', Date.now());

  return results;
}

async function fetchData(product, component) {
  if (offline) {
    return fetchedResults;
  } else {
    let results = await (await fetch(`.netlify/functions/bugs/${product}/${component}`)).json();
    results.shift();
    results = results.map(row => createData(...row));
    return results;
  }
}

async function parse() {
  try {
    let localData = await localStorage.getItem('results');
    return JSON.parse(localData) || [];
  } catch (e) {
    localStorage.clear();
    return [];
  }
}

function formatResults(results) {
  const map = {};

  const metas = [];
  for (const result of results) {
    if (isMeta(result)) {
      metas.push(result);
    }
  }

  for (const result of results) {
    map[result.BugID] = result;
  }

  for (const result of results) {
    result.Metas = result.Blocks.split(', ')
      .filter(id => id != '')
      .map(id => {
        const bug = map[id];
        if (bug) {
          return { ...bug, name: bug.Alias || id };
        }

        return { BugID: id, name: id };
      })
      .filter(i => i);
  }

  const bugs = results;
  window.bugs = bugs;
  window.bugMap = map;

  return { bugs, metas, bugsMap: map };
}

export async function getBugs(product, component) {
  const results = await parse();
  const fetched = fetchData(product, component)
    .then(saveData)
    .then(formatResults);

  return { fetched, ...formatResults(results) };
}
