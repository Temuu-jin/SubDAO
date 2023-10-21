import '../../globals.css';
import React from 'react';

export default function Login() {
  return (
    <main>
      <div className=" flex items-center justify-center">
        <div className=" h-[10%] w-full max-w-sm shadow-2xl bg-base-100 ">
          <form className="">
            <div className="">
              <label htmlFor="email" className="label">
                <span className="">Email</span>
              </label>
              <input type="email" placeholder="email" className="" required />
            </div>
            <div className="">
              <label htmlFor="password" className="label">
                <span className="">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className=""
                required
              />
              <label htmlFor="forgotpassword" className="">
                <a id="forgotpassword" href="/" className="">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="">Login</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
