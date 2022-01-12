import React, { useState } from "react";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { FaUserCircle } from "react-icons/fa";
import propTypes from "prop-types";

async function saveMessage(messageText, currentUser, path, username) {
  const collectionPath = path || `tweets`;
  try {
    let tweet = {
      authorUID: currentUser.uid,
      name: currentUser.displayName,
      username: currentUser.username,
      text: messageText,
      profilePicUrl: currentUser.photoURL,
      timestamp: serverTimestamp(),
    };
    if (path) {
      tweet = { respondingTo: username, ...tweet };
    }

    await addDoc(collection(getFirestore(), collectionPath), tweet);
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
}

function TweetForm({ id, username }) {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentUser"))
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (id) {
      saveMessage(
        e.target.tweet.value,
        currentUser,
        `/tweets/${id}/responds`,
        username
      );
    }
    saveMessage(e.target.tweet.value, currentUser);
    e.target.tweet.value = "";
  }
  return (
    <article className="flex gap-4 p-4">
      <div>
        <div className="w-12 h-12">
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="" className="rounded-full" />
          ) : (
            <FaUserCircle className="text-5xl" />
          )}
        </div>
      </div>
      <form action="" className="flex-1" onSubmit={handleSubmit}>
        <textarea
          name="tweet"
          id="tweet-area"
          placeholder="What's happening?"
          rows="2"
          maxLength="280"
          className="w-full h-auto px-4 py-4 resize-none border-b focus:outline-none"
        />
        <div className="flex items-center justify-between">
          {/*           <label
            className="cursor-pointer p-2 rounded-full trans-hover hover:bg-blue-100"
            htmlFor="file"
          >
            <span>
              <AiOutlinePicture className="text-xl text-blue-500" />
            </span>
            <input
              type="file"
              id="file"
              name="file"
              aria-label="File browser"
              className="hidden"
            />
          </label> */}
          <button
            type="submit"
            className="my-2 py-1 px-4 rounded-full font-medium text-white bg-blue-500 disabled:bg-blue-300"
          >
            Tweet
          </button>
        </div>
      </form>
    </article>
  );
}

TweetForm.propTypes = {
  id: propTypes.string,
  username: propTypes.string,
};

TweetForm.defaultProps = {
  id: undefined,
  username: undefined,
};

export default TweetForm;
