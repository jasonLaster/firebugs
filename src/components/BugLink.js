import React from 'react';
import { isMeta } from '../utils';

export function BugLink({ bug, children }) {
  return (
    <a
      target="_blank"
      className="bugSummary"
      rel="noopener noreferrer"
      href={`https://bugzilla.mozilla.org/${bug.BugID}`}
    >
      {children}
    </a>
  );
}

export function BugSummaryLink({ bug }) {
  return (
    <a
      target="_blank"
      className="bugSummary"
      rel="noopener noreferrer"
      href={`https://bugzilla.mozilla.org/${bug.BugID}`}
    >
      {bug.Summary}{' '}
    </a>
  );
}

export function BugIDLink({ bug }) {
  return (
    <a
      target="_blank"
      className="bugId"
      rel="noopener noreferrer"
      href={`https://bugzilla.mozilla.org/${bug.BugID}`}
    >
      {bug.BugID}
    </a>
  );
}
