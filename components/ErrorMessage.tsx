import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div 
      className="p-4 my-4 text-sm rounded-lg bg-[var(--kraft-error-bg-light)] text-[var(--kraft-error-text-light)] dark:bg-[var(--kraft-error-bg-dark)] dark:text-[var(--kraft-error-text-dark)] border border-[var(--kraft-error-text-light)] dark:border-[var(--kraft-error-text-dark)]" 
      role="alert"
    >
      <span className="font-semibold font-special">Error:</span> {message}
    </div>
  );
};

export default ErrorMessage;