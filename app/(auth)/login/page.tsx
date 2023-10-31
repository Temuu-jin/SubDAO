import '../../globals.css';
import React from 'react';
import LoginForm from '../../components/LoginForm';

export default function Login() {
  return (
    <main className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto bg-white rounded shadow p-4">
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
