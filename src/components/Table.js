import React from 'react';
import { BugIDLink, BugSummaryLink, BugLink } from './BugLink';
import { isMeta } from '../utils';
import './Table.css';

function Metas({ metas, setMeta }) {
  return metas.map(b => (
    <span key={b.BugID} className="meta" onClick={() => setMeta(b.name)}>
      {b.name}
    </span>
  ));
}

function formatIntermittent(bug) {
  const match = bug.Summary.match(/Intermittent (.*) \| (.*) -/i);
  if (!match) {
    return bug.Summary;
  }
  const [, testPath, error] = match;
  const test = testPath.split(/\//).slice(-1)[0];
  return (
    <div>
      <div className="test-file">{test}</div>
      <div className="test-error">{error} </div>
    </div>
  );
  // return bug.Summary;
}

function Row({ bug, filters, setMeta, setPriority }) {
  const showIntermittents = filters.page == 'intermittents';
  const shownMetas = bug.Metas.filter(meta => meta.name != filters.meta);
  return (
    <tr>
      <td>
        <div className="bug-summary">
          <span className="bug-alias">{isMeta(bug) ? bug.Alias : ''}</span>{' '}
          <BugLink bug={bug}>
            {showIntermittents ? formatIntermittent(bug) : bug.Summary}{' '}
          </BugLink>
        </div>
        <div className="meta-list">
          <Metas metas={shownMetas} setMeta={setMeta} />
        </div>
      </td>
      {showIntermittents ? (
        <td
          className={`fail-count ${
            Number(bug.failCount) > 20 ? 'important' : ''
          }`}
        >
          {bug.failCount}{' '}
        </td>
      ) : null}
      <td
        className={`priority ${bug.Priority}`}
        align="left"
        onClick={() => setPriority(bug.Priority)}
      >
        <div>{bug.Priority}</div>
      </td>
    </tr>
  );
}

function SimpleTable({ rows, filters, setMeta, setPriority }) {
  if (rows.length == 0) {
    return <h2 className="empty-results"> No results found</h2>;
  }

  return (
    <div className="bugs-table">
      <table className="pure-table pure-table-horizontal">
        <tbody>
          {rows.map(row => (
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
