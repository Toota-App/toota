// Message.jsx

import React from 'react';

const Message = ({ message, type }) => {
  const containerClassName = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textClassName = type === 'success' ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`${containerClassName} border border-${type === 'success' ? 'green' : 'red'}-400 ${textClassName} px-4 py-3 rounded mb-4`}>
      <strong className={`font-bold ${textClassName}`}>{type === 'success' ? 'Success:' : 'Error:'}</strong>
      <span className={`block sm:inline ${textClassName}`}> {message}</span>
    </div>
  );
};

export default Message;

