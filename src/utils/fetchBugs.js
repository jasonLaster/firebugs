

function createData(BugID,
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
  Keywords) {
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
    Keywords
  };
}


async function fetchData() {
  const results =  await (await fetch(".netlify/functions/bugs")).json()
  results.shift();
  return results.map(row => createData(...row))
}

export async function getBugs(force = false) {
  const oldData = Number(await localStorage.getItem("updated")) < Date.now() - 10*60000;
  let localData = await localStorage.getItem("results");
  let results;
  if (force || !localData || oldData) {
    results = await fetchData();
    localStorage.setItem("results", JSON.stringify(results));
    localStorage.setItem("updated", Date.now())
  } else {
    results = JSON.parse(localData);
  }

  window.bugs = results;
  return results;
}
