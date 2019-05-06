import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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


function SimpleTable( props) {
  const { classes, rows } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>BugId</TableCell>
<TableCell align="right">Priority</TableCell>
            <TableCell >Summary</TableCell>
            <TableCell align="right">Assignee</TableCell>
            <TableCell align="right">Blocks</TableCell>
            <TableCell align="right">Depends On</TableCell>
            <TableCell align="right">Keyword</TableCell>
            <TableCell align="right">Whiteboard</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell align="right">{row.BugID}</TableCell>
              <TableCell align="right">{row.Priority}</TableCell>
              <TableCell >{row.Summary}</TableCell>
              <TableCell align="right">{row.Assignee}</TableCell>
              <TableCell align="right">{row.Blocks}</TableCell>
              <TableCell align="right">{row.DependsOn}</TableCell>
              <TableCell align="right">{row.Keyword}</TableCell>
              <TableCell align="right">{row.Whiteboard}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
