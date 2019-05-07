import React from 'react';

import BugLink from './BugLink';
export default function Meta({ meta, resultsMap }) {
  const deps = meta.DependsOn.split(', ');
  const openBugs = deps.map(dep => resultsMap[dep]).filter(i => i);
  const completeCount = deps.length - openBugs.length;

  return (
    <div className="meta">
      <div className="meta-header">
        {meta.Alias ? <div className="alias">{meta.Alias}</div> : null}
        <div className="summary">{meta.Summary}</div>
        <div class="progress">
          {openBugs.length} / {completeCount}
        </div>
      </div>
      <div>
        <div className="meta-body">
          {openBugs.map(bug => (
            <div className="dep" key={bug.BugID}>
              <BugLink bug={bug} />
              <div className="summary">{bug.Summary} </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
