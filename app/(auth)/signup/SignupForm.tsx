'use client';
import '../../globals.css';
import { gql, useMutation } from '@apollo/client';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

const createUserMutation = gql`
  mutation CreateUser($email: String!, $username: String!, $password: String!) {
    registerUser(email: $email, username: $username, password: $password) {
      id
      email
      username
    }
  }
`;

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [createUser] = useMutation(createUserMutation, {
    variables: {
      email,
      username,
      password,
    },
    onError: (error) => {
      setOnError(error.message);
      return onError;
    },
    onCompleted: async () => {
      await router.push('/login');
    },
  });

  return (
    <div className="card flex-shrink-1 h-[10%] w-full max-w-sm shadow-2xl bg-base-100">
      <form
        onSubmit={async (e) => {
          e.preventDefault(); // Prevent the default form submission
          await createUser();
        }}
        className="card-body"
      >
        <div className="form-control">
          <label htmlFor="email" className="label">
            <span className="label-text">E-Mail</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="email"
            className="input input-bordered"
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />
        </div>
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
        <div className="form-control">
          <label htmlFor="confirm password" className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            name="confirm password"
            placeholder="confirm password"
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
