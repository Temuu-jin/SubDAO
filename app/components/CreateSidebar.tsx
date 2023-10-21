import React from 'react';

export function CreateSidebar() {
  return (
    <div className="card flex flex-1  h-[1056px] glass ml-[24px] my-8 align-bottom basis-3/7">
      <div className="card-body">
        <div className="card-actions justify-center">
          <button className="btn btn-secondary">Create DAO</button>
        </div>
        <ul>
          <li>DAO placeholder 1</li>
          <li>DAO placeholder 2</li>
          <li>DAO placeholder 3</li>
          <li>DAO placeholder 4</li>
          <li>DAO placeholder 5</li>
          <li>DAO placeholder 6</li>
        </ul>
      </div>
    </div>
  );
}

export default CreateSidebar;
