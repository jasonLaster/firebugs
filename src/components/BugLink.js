import React from 'react';

export function BugSummaryLink({ bug }) {
  return (
    <a
      target="_blank"
      className="bugId"
      rel="noopener noreferrer"
      href={`https://bugzilla.mozilla.org/${bug.BugID}`}
    >
      {bug.Summary}
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
