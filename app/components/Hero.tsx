import React from 'react';

export function Hero() {
  return (
    <div className="bg-emerald-400 rounded shadow p-4">
      <h2 className="text-2xl font-bold mb-2">Welcome to Subdapp</h2>
      <p>Join our community and explore DAOs.</p>
      <button className="bg-blue-500 text-white rounded px-4 py-2 mt-4">
        Join Now
      </button>
    </div>
  );
}

export default Hero;
