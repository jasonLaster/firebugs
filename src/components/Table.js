import React from 'react';
import { BugIDLink, BugSummaryLink } from './BugLink';
import { sortByPriority } from '../utils';

import './Table.css';

function formatSummary(summary) {
  // if (summary.match('Intermittent devtools')) {
  //   const test = summary.match(/^.*\/(.*)\|/)[1];
  //   return `Intermittent ${test}`;
  // }
  return summary;
}

function Row({ bug, filters, setMeta, setPriority }) {
  const shownMetas = bug.Metas.filter(
    meta => (meta.Alias || meta.BugID) != filters.meta
  );
  return (
    <tr>
      <td align="left">
        <BugIDLink bug={bug} />
      </td>
      <td>
        {<BugSummaryLink bug={bug} />}
        {shownMetas.map(b => (
          <span
            key={b.BugID}
            className="meta"
            onClick={() => setMeta(b.Alias || b.BugID)}
          >
            {b.Alias || b.BugID}
          </span>
        ))}
      </td>
      <td
        className={`priority ${bug.Priority}`}
        align="left"
        onClick={() => setPriority(bug.Priority)}
      >
        {bug.Priority}
      </td>
    </tr>
  );
}

function SimpleTable({ classes, rows, filters, setMeta, setPriority }) {
  if (rows.length == 0) {
    return <h2 className="empty-results"> No results found</h2>;
  }

  return (
    <div className="bugs-table">
      <table className="pure-table pure-table-horizontal">
        <tbody>
          {sortByPriority(rows).map(row => (
            <Row
              key={row.BugID}
              bug={row}
              filters={filters}
              setMeta={setMeta}
              setPriority={setPriority}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

SimpleTable.propTypes = {};

export default SimpleTable;
