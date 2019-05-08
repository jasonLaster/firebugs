import React from 'react';
import { BugIDLink } from './BugLink';
import { sortByPriority } from '../utils';

function formatSummary(summary) {
  // if (summary.match('Intermittent devtools')) {
  //   const test = summary.match(/^.*\/(.*)\|/)[1];
  //   return `Intermittent ${test}`;
  // }
  return summary;
}

function Row({ bug, selectMeta }) {
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
            onClick={() => selectMeta(b.Alias || b.BugID)}
          >
            {b.Alias || b.BugID}
          </span>
        ))}
      </td>
      <td align="left">{bug.Priority}</td>
    </tr>
  );
}

function SimpleTable({ classes, rows, selectMeta }) {
  return (
    <div className="bugs-table">
      <table className="pure-table pure-table-horizontal">
        <tbody>
          {sortByPriority(rows).map(row => (
            <Row key={row.BugID} bug={row} selectMeta={selectMeta} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

SimpleTable.propTypes = {};

export default SimpleTable;
