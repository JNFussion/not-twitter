import { getAuth, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import TweetForm from "./TweetForm";

function signOutUser() {
  signOut(getAuth());
}

function Layout(params) {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentUser"))
  );
  const [isHidden, setIsHidden] = useState(true);

  return (
    <article className="max-w-6xl mx-auto grid grid-cols-layout">
      <div>
        <Navbar />
        <article className="my-10 grid gap-8">
          <button
            type="button"
            className={isHidden ? "hidden" : ""}
            onClick={signOutUser}
          >
            Log out {currentUser.displayName}
          </button>
          <button
            type="button"
            className="flex items-center gap-4"
            onClick={() => setIsHidden((prevState) => !prevState)}
          >
            <div className="w-12">
              <img src={currentUser.photoURL} alt="" className="rounded-full" />
            </div>
            <h2>{currentUser.displayName}</h2>
          </button>
        </article>
      </div>

      <main className="border-x">
        <h1 className="p-4 font-bold text-xl">Home</h1>
        <TweetForm currentUser={currentUser} />
      </main>
      <aside>ASIDE</aside>
    </article>
  );
}

export default Layout;
