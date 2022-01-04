import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";

function signOutUser() {
  signOut(getAuth());
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
          <img src={currentUser.photoURL} alt="" className="rounded-full" />
        </div>
        <h2>{currentUser.displayName}</h2>
      </button>
    </article>
  );
}

export default ProfileBtn;
