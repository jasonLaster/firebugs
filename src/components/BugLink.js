import React from 'react';

export default function({ bug }) {
  return (
    <a
      target="none"
      className="bugId"
      href={`https://bugzilla.mozilla.org/${bug.BugID}`}
    >
      {bug.BugID}
    </a>
  );
}
