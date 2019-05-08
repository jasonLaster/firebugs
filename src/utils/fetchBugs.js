import { fetchedResults } from './results';

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
  window.bugs = results;
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

export async function getBugs() {
  let localData = await localStorage.getItem('results');
  const results = localData ? parse(localData) : [];
  const fetched = fetchData().then(saveData);

  window.bugs = results;
  return { results, fetched };
}
