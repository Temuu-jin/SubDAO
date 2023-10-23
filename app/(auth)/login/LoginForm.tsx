'use client';
import '../../globals.css';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const login = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
    }
  }
`;

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState('');

  const [loginUser] = useMutation(login, {
    variables: {
      username,
      password,
    },
    onError: (error) => {
      setOnError(error.message);
      return onError;
    },
    onCompleted: () => {
      setOnError('');
      setUsername('');
      setPassword('');
    },
  });

  return (
    <div className="card flex-shrink-1 h-[10%] w-full max-w-sm shadow-2xl bg-base-100">
      <form onSubmit={async () => await loginUser()} className="card-body">
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
