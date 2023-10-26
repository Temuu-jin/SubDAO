'use client';
import { logout } from './actions';

export default function Signout() {
  return (
    <form>
      <button formAction={() => logout()}>Signout</button>
    </form>
  );
}
