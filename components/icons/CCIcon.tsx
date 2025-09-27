import React from 'react';

const CCIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M4.5 3A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3h-15zm5.09 5.09a.75.75 0 01.95-.447 5.25 5.25 0 012.91 4.857.75.75 0 01-1.49.143 3.75 3.75 0 00-2.08-3.414.75.75 0 01-.29-1.14zm4.5 0a.75.75 0 01.95-.447 5.25 5.25 0 012.91 4.857.75.75 0 01-1.49.143 3.75 3.75 0 00-2.08-3.414.75.75 0 01-.29-1.14z"
      clipRule="evenodd"
    />
  </svg>
);

export default CCIcon;
