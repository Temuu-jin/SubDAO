'use client';
import '../../globals.css';
import { gql, useMutation } from '@apollo/client';
import { redirect, useRouter } from 'next/navigation';
import Router from 'next/router';
import { useState } from 'react';

const loginUser = gql`
  mutation loginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      user {
        id
        email
        username
      }
    }
  }
`;

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [login] = useMutation(loginUser, {
    variables: {
      username,
      password,
    },
    onError: (error) => {
      setOnError(error.message);
      console.log('error1: ', error.message);
      return onError;
    },
    onCompleted: async () => {
      await router.push('/profile');
      await router.refresh();
    },
  });

  return (
    <div className="card flex-shrink-1 h-[10%] w-full max-w-sm shadow-2xl bg-base-100">
      <form
        onSubmit={async (e) => {
          e.preventDefault(); // Prevent the default form submission
          await login();
        }}
        className="card-body"
      >
        <div className="form-control">
          <label htmlFor="username" className="label">
            <span className="label-text">username</span>
          </label>
          <input
            type="username"
            name="username"
            onChange={(event) => setUsername(event.currentTarget.value)}
            placeholder="username"
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="password" className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            onChange={(event) => setPassword(event.currentTarget.value)}
            placeholder="password"
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control mt-6">
          <button className="btn btn-primary">Sign up</button>
        </div>
      </form>
    </div>
  );
}
