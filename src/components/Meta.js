import React from 'react';

import { sortByPriority, isMeta } from '../utils';
import { BugIDLink, BugSummaryLink } from './BugLink';
import Table from './Table';

import './Meta.css';

const newBugHref = id =>
  `https://bugzilla.mozilla.org/enter_bug.cgi?format=__default__&product=DevTools&component=Debugger&blocked=${id}`;

export default function Meta({
  meta,
  bugsMap,
  filteredIds,
  filters,
  setMeta,
  setPriority,
}) {
  const deps = meta.DependsOn.split(', ');
  const openBugs = deps.map(dep => bugsMap[dep]).filter(i => i);
  const completeCount = deps.length - openBugs.length;
  const progress = `${(completeCount / deps.length) * 100}%`;

  const shownBugs = sortByPriority(
    openBugs.filter(b => filteredIds.has(b.BugID))
  );

  if (shownBugs.length == 0) {
    return null;
  }

  return (
    <div className="meta">
      <div className="meta-header">
        <div className="summary">
          <span className="bug-alias">{isMeta(meta) ? meta.Alias : ''}</span>{' '}
          <BugSummaryLink bug={meta} />
        </div>
        <div className="progress">
          {completeCount} / {deps.length}
        </div>
        <a
          href="#"
          className="new-bug"
          href={newBugHref(meta.BugID)}
          target="none"
        >
          +
        </a>
      </div>
      <div>
        <div className="meta-body">
          <Table
            rows={openBugs}
            setMeta={setMeta}
            setPriority={setPriority}
            filters={{ ...filters, meta: meta.Alias || meta.BugID }}
          />
        </div>
        <div className="meta-footer">
          <div className="progress-bar">
            <div className="progress" style={{ width: progress }} />
          </div>
        </div>
      </div>
    </div>
  );
}
