import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import propTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Signup({ account }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [displayName, setDisplayName] = useState();
  const [bio, setBio] = useState();
  const [userLocation, setUserLocation] = useState();
  const [pos, setPos] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentUser"))
  );

  async function createProfile(user) {
    updateProfile(user, {
      displayName,
    }).then(() => {
      try {
        addDoc(collection(getFirestore(), "user"), {
          uid: user.uid,
          username,
          bio,
          userLocation,
        }).then(() => {
          sessionStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...user,
              username,
              bio,
              userLocation,
            })
          );
          navigate(from, { replace: true });
        });
      } catch (error) {
        console.error("Error writing new message to Firebase Database", error);
      }
    });
  }

  async function signIn() {
    const { user } = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    createProfile(user);
  }

  // eslint-disable-next-line consistent-return
  function handleSubmit(e) {
    e.preventDefault();
    if (account) {
      signIn();
      return;
    }
    createProfile(getAuth().currentUser);
    navigate(from, { replace: true });
  }

  useEffect(() => {
    if (!account && pos === 0) {
      setPos((prevPos) => prevPos + 1);
    }
    return () => {};
  }, []);

  return (
    <form
      action=""
      className="p-4 rounded border border-white bg-black text-white"
      onSubmit={handleSubmit}
    >
      {pos === 0 && account && (
        <fieldset className="grid gap-4">
          <label htmlFor="signup-email">
            <div>Email</div>
            <input
              id="signup-email"
              type="email"
              name="signup-email"
              onChange={(e) => setEmail(e.target.value)}
              className="py-1 px-4 border border-white rounded bg-black focus:outline-none focus:border-blue-500"
            />
          </label>
          <label htmlFor="signup-password">
            <div>Password</div>
            <input
              name="signup-password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="py-1 px-4 border border-white rounded bg-black focus:outline-none focus:border-blue-500"
            />
          </label>
          <div className="py-2">
            <button
              type="button"
              onClick={() => setPos((prevPos) => prevPos + 1)}
              className="block ml-auto px-4 py-2 rounded-full font-bold bg-blue-500"
            >
              Next
            </button>
          </div>
        </fieldset>
      )}

      {pos === 1 && (
        <fieldset className="grid gap-4">
          <label htmlFor="username">
            <div>Username</div>
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              className="py-1 px-4 border border-white rounded bg-black focus:outline-none focus:border-blue-500"
            />
          </label>
          <label htmlFor="display-name">
            <div>Full Name</div>
            <input
              type="text"
              onChange={(e) => setDisplayName(e.target.value)}
              className="py-1 px-4 border border-white rounded bg-black focus:outline-none focus:border-blue-500"
            />
          </label>

          <label htmlFor="location">
            <div>Location</div>
            <input
              type="text"
              onChange={(e) => setUserLocation(e.target.value)}
              className="py-1 px-4 border border-white rounded bg-black focus:outline-none focus:border-blue-500"
            />
          </label>
          <div className="py-2 flex gap-2 justify-end">
            {account && (
              <button
                type="button"
                onClick={() => setPos((prevPos) => prevPos - 1)}
                className="px-4 py-2 rounded-full font-bold bg-white text-black"
              >
                Back
              </button>
            )}
            <button
              type="button"
              className="px-4 py-2 rounded-full font-bold bg-blue-500"
              onClick={() => setPos((prevPos) => prevPos + 1)}
            >
              Next
            </button>
          </div>
        </fieldset>
      )}
      {pos === 2 && (
        <fieldset className="grid gap-4">
          <label htmlFor="username">
            <div>Biography</div>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              className="py-1 px-4 border border-white rounded bg-black resize-none focus:outline-none focus:border-blue-500"
            />
          </label>

          <div className="py-2 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setPos((prevPos) => prevPos - 1)}
              className="px-4 py-2 rounded-full font-bold bg-white text-black"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full font-bold bg-blue-500"
            >
              Save
            </button>
          </div>
        </fieldset>
      )}
    </form>
  );
}

Signup.propTypes = {
  account: propTypes.bool,
};
Signup.defaultProps = {
  account: false,
};

export default Signup;
