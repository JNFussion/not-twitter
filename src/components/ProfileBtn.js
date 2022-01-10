import { FaUserCircle } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function signOutUser() {
  signOut(getAuth());
}

function ProfileBtn() {
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
        <Link to="/login">Log out {currentUser.displayName}</Link>
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
