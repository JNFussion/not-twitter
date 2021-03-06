import React, { useState } from "react";
import { FaTimesCircle, FaTwitter } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import "firebaseui/dist/firebaseui.css";
import Signup from "./Signup";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [signup, setSignup] = useState(false);

  async function signIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider).then((response) => {
      sessionStorage.setItem("currentUser", JSON.stringify(response.user));
      navigate(from, { replace: true });
    });
  }

  function login(e) {
    e.preventDefault();
    signInWithEmailAndPassword(
      getAuth(),
      e.target.email.value,
      e.target.password.value
    )
      .then((response) => {
        sessionStorage.setItem("currentUser", JSON.stringify(response.user));
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Cannot login", error);
      });
  }

  return (
    <div className="grid lg:grid-cols-2 auto-rows-fr">
      <article className=" grid grid-rows-2">
        <header className="place-self-center p-10 text-4xl lg:text-6xl xl:text-8xl font-bold rounded-md shadow-lg shadow-blue-100/30 bg-blue-100">
          <h1 className="flex items-center gap-4 ">
            <span>
              <FaTwitter className="text-6xl lg:text-7xl xl:text-9xl text-blue-500 " />
            </span>
            <span>Not Twitter</span>
          </h1>
        </header>
        <div className="max-w-lg mx-auto px-2">
          <h2 className="mb-2 text-3xl font-bold text-center">
            ***DISCAIMER***
          </h2>
          <p className="text-xl">
            This site is not Twitter. It&apos;s a clone of it. I don&apos;t have
            any malicious intention. This site is for self educational purpose.
          </p>
        </div>
      </article>
      <div className="h-[50vh] lg:h-screen grid place-items-center place-content-center text-white bg-black ">
        <button
          type="button"
          className="flex items-center gap-4 px-4 py-2 rounded-full text-black bg-white"
          onClick={signIn}
        >
          <span className="text-lg">
            <FcGoogle />
          </span>
          <span>Sign up with Google</span>
        </button>
        <div id="sign-divider">o</div>
        <button
          type="button"
          className="px-4 py-2 rounded-full bg-blue-500"
          onClick={() => setSignup(true)}
        >
          Sign up
        </button>

        <form action="" className="w-96 grid gap-3 my-6" onSubmit={login}>
          <label htmlFor="email" className="mx-2">
            <div>Email</div>
            <input
              required
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-2 border border-white rounded-sm bg-black focus:outline-none focus:outline focus:outline-blue-500"
            />
          </label>
          <label htmlFor="password" className="mx-2">
            <div>Password</div>
            <input
              required
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-2 border border-white rounded-sm bg-black focus:outline-none focus:outline focus:outline-blue-500"
            />
          </label>
          <button
            type="submit"
            className="w-fit mx-auto px-6 py-2 rounded-full text-lg bg-blue-500"
          >
            Login
          </button>
        </form>
      </div>

      <div
        className={`${
          !signup ? "hidden" : ""
        } absolute h-screen w-full grid place-content-center bg-black/40`}
      >
        <div id="signup-container">
          <button
            type="button"
            className="block ml-auto my-2 text-lg text-white cursor-pointer"
            onClick={() => setSignup(false)}
          >
            <FaTimesCircle />
          </button>
          <Signup account />
        </div>
      </div>
    </div>
  );
}

export default Login;
