import React from 'react';
import PropTypes from 'prop-types';
import { BugIDLink } from './BugLink';

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
    <tr key={bug.BugID}>
      <td align="left">
        <BugIDLink bug={bug} />
      </td>
      <td>
        {formatSummary(bug.Summary)}
        {blocks.map(b => (
          <span className="meta">{b.Alias || b.BugID}</span>
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
          {rows.map(row => (
            <Row bug={row} bugs={bugs} />
          ))}
        </tbody>
      </table>
    </div>
    // </Paper>
  );
}

SimpleTable.propTypes = {};

export default SimpleTable;
