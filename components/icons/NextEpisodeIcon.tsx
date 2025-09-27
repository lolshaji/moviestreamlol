import React from 'react';

const NextEpisodeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M5.25 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L8.029 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653zM18 5.25a.75.75 0 00-.75.75v12c0 .414.336.75.75.75s.75-.336.75-.75V6a.75.75 0 00-.75-.75z" />
    </svg>
);

export default NextEpisodeIcon;
