import React from 'react';
import PropTypes from 'prop-types';
import BugLink from './BugLink';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

function SimpleTable(props) {
  const { classes, rows } = props;

  return (
    // <Paper className={classes.root}>
    <div className="bugs-table">
      <table className="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th align="left">BugId</th>
            <th align="left">Priority</th>
            <th align="left">Summary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.BugID}>
              <td align="left">
                <BugLink bug={row} />
              </td>
              <td align="left">{row.Priority}</td>
              <td>{row.Summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    // </Paper>
  );
}

SimpleTable.propTypes = {};

export default SimpleTable;
