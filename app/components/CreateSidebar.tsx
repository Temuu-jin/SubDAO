import React from 'react';

export function CreateSidebar() {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold mb-2">DAOs</h2>
      <ul className="list-disc pl-5">
        <li>DAO placeholder 1</li>
        <li>DAO placeholder 2</li>
        // ... other DAOs
      </ul>
    </div>
  );
}

export default CreateSidebar;
