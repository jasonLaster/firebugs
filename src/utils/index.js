import { sortBy } from 'lodash';

export function sortByPriority(bugs) {
  return sortBy(bugs, bug =>
    bug.Priority.match(/\d/) ? +bug.Priority.match(/\d/)[0] : 10
  );
}

export function isMeta(bug) {
  return bug.Keywords.includes('meta');
}

export function isIntermittent(bug) {
  return bug.Keywords.includes('intermittent');
}

export async function fetchComponents(search) {
  // Ensures we don't make request with overly broad search term.
  if (search && search.length > 2) {
    const results = await (await fetch(
      `.netlify/functions/components?searchText=${search}`
    )).json();

    const formattedResults = formatComponentsResults(results.products);
    return formattedResults;
  }
};

export function formatComponentsResults(results) {
  const groupedComponents = [];
  let temporaryStorage;

  results.forEach(function (result) {
    if (!result.component && result.product) {
      temporaryStorage = { label: result.product, options: [] };
      groupedComponents.push(temporaryStorage);
    } else {
      temporaryStorage.options.push({
        value: result.component,
        label: result.component,
        product: temporaryStorage.label
      });
    }
  });

  return groupedComponents;
}
