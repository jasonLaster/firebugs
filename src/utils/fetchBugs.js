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
      .map(id => {
        const bug = map[id];
        if (bug) {
          return { ...bug, name: bug.Alias || bug.BugID };
        }
      })
      .filter(i => i);
  }

  const bugs = results;
  window.bugs = bugs;
  window.bugMap = map;

  return { bugs, metas, bugsMap: map };
}

export async function getBugs() {
  const results = await parse();
  const fetched = fetchData()
    .then(saveData)
    .then(formatResults);

  return { fetched, ...formatResults(results) };
}
