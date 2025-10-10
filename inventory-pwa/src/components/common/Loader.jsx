import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center justify-center p-6 min-h-[100px]">
      <div className="spinner" role="status" aria-label="Loading"></div>
    </div>
  );
}