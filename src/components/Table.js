import React from 'react';
import { BugIDLink } from './BugLink';
import { sortByPriority } from '../utils';

import './Table.css';

function formatSummary(summary) {
  // if (summary.match('Intermittent devtools')) {
  //   const test = summary.match(/^.*\/(.*)\|/)[1];
  //   return `Intermittent ${test}`;
  // }
  return summary;
}

function Row({ bug, setMeta, setPriority }) {
  return (
    <tr>
      <td align="left">
        <BugIDLink bug={bug} />
      </td>
      <td>
        {formatSummary(bug.Summary)}
        {bug.Metas.map(b => (
          <span
            key={b.BugID}
            className="meta"
            onClick={() => setMeta(b.Alias || b.BugID)}
          >
            {b.Alias || b.BugID}
          </span>
        ))}
      </td>
      <td align="left" onClick={() => setPriority(bug.Priority)}>
        {bug.Priority}
      </td>
    </tr>
  );
}

function SimpleTable({ classes, rows, setMeta, setPriority }) {
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
