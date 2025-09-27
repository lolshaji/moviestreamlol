import React from 'react';

const RewindIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 19.5l-7.5-7.5 7.5-7.5" />
  </svg>
);

export default RewindIcon;