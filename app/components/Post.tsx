import React from 'react';

export function Post() {
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Life hack</h2>
      <p>How to park your car at your garage? ...</p>
      <div className="flex justify-end mt-4">
        <button className="bg-blue-500 text-white rounded px-4 py-2">
          Comment
        </button>
      </div>
    </div>
  );
}

export default Post;
