import React from 'react';

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9.594 3.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.198-.198 1.722.056l.062.029a9 9 0 014.28 3.32l.158.249c.428.673.61 1.48.504 2.274-.106.794-.468 1.54-1.02 2.112l-.022.022c-.552.552-1.3.88-2.112 1.02-.794.106-1.602-.076-2.274-.504l-.249-.158a9.002 9.002 0 01-3.32-4.28l-.029-.062c-.254-.524-.274-1.172-.056-1.722.218-.55.684-1.017 1.226-1.11l.099-.018z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" 
    />
  </svg>
);

export default SettingsIcon;