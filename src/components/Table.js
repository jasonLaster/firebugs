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

function Row({ bug, bugs }) {
  const blocks = bug.Blocks.split(',')
    .map(id => bugs[id])
    .filter(i => i);
  return (
    <tr>
      <td align="left">
        <BugIDLink bug={bug} />
      </td>
      <td>
        {formatSummary(bug.Summary)}
        {blocks.map(b => (
          <span key={b.BugID} className="meta">
            {b.Alias || b.BugID}
          </span>
        ))}
      </td>
      <td align="left">{bug.Priority}</td>
    </tr>
  );
}

function SimpleTable({ classes, rows, bugs }) {
  return (
    // <Paper className={classes.root}>
    <div className="bugs-table">
      <table className="pure-table pure-table-horizontal">
        <tbody>
          {sortByPriority(rows).map(row => (
            <Row key={row.BugID} bug={row} bugs={bugs} />
          ))}
        </tbody>
      </table>
    </div>
    // </Paper>
  );
}

SimpleTable.propTypes = {};

export default SimpleTable;
