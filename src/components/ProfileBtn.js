import { FaUserCircle } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";

function signOutUser() {
  signOut(getAuth());
  sessionStorage.setItem("currentUser", null);
}

function ProfileBtn(params) {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentUser"))
  );
  const [isHidden, setIsHidden] = useState(true);

  return (
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
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="" className="rounded-full" />
          ) : (
            <FaUserCircle className="text-5xl" />
          )}
        </div>
        <h2>{currentUser.displayName}</h2>
      </button>
    </article>
  );
}

export default ProfileBtn;
