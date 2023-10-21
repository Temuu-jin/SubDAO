import React from 'react';

export function Post() {
  return (
    <div className="card min-w-[640px] max-w-[750px] max-h-[336px] glass my-8">
      <div className="card-body">
        <h2 className="card-title">Life hack</h2>
        <p className="wrap">
          How to park your car at your garage? Well, its easy. I dont have a
          license but here I go: You use your sidemirrors to estimate your cars
          position and adjust the steering wheel accordingly
        </p>
        <div className="card-actions justify-end">
          <button className="border px-3 rounded-md my-2">Comment</button>
        </div>
      </div>
    </div>
  );
}

export default Post;
