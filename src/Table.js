import React from 'react';
import PropTypes from 'prop-types';

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
        <tr>
          <th>BugId</th>
          <th align="right">Priority</th>
          <th>Summary</th>
        </tr>
        <tbody>
          {rows.map(row => (
            <tr key={row.BugID}>
              <td align="right">
                <a
                  target="none"
                  href={`https://bugzilla.mozilla.org/${row.BugID}`}
                >
                  {' '}
                  {row.BugID}
                </a>
              </td>
              <td align="right">{row.Priority}</td>
              <td>{row.Summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    // </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default SimpleTable;
