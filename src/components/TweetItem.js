/* eslint-disable react/forbid-prop-types */
import { formatDistanceToNow, getTime, secondsToMilliseconds } from "date-fns";
import {
  FaHeart,
  FaRegComment,
  FaRegHeart,
  FaTimesCircle,
  FaUserCircle,
} from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import TweetForm from "./TweetForm";
import { getCurrentUser } from "../firebase-config";

function like(id, uid) {
  addDoc(collection(getFirestore(), "likes"), {
    id,
    uid,
  });
}

function unlike(id) {
  deleteDoc(doc(getFirestore(), "likes", id));
}

async function saveRetweet(
  id,
  currentUserUID,
  currentUserDisplayName,
  currentUserUsername
) {
  try {
    await addDoc(collection(getFirestore(), `retweets`), {
      tweetID: id,
      retweetUid: currentUserUID,
      retweetDisplayName: currentUserDisplayName,
      retweetUsername: currentUserUsername,
    });
  } catch (error) {
    console.error("Error writing new message to Firebase Database", error);
  }
}

function removeRetweet(id) {
  deleteDoc(doc(getFirestore(), "retweets", id));
}

function TweetItem({
  id,
  name,
  profilePicUrl,
  text,
  timestamp,
  username,
  modalTweet,
  respondingTo,
  retweetInfo,
}) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [respondTo, setRespondTo] = useState(false);

  const [liked, setLiked] = useState();
  useEffect(() => {
    if (currentUser) {
      onSnapshot(
        query(
          collection(getFirestore(), "likes"),
          where("uid", "==", currentUser.uid),
          where("id", "==", id)
        ),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "removed") {
              setLiked(undefined);
            } else {
              setLiked({ likeID: change.doc.id, ...change.doc.data() });
            }
          });
        }
      );
    }
    return () => {};
  }, []);

  const [retweet, setRetweet] = useState();
  useEffect(() => {
    if (currentUser) {
      onSnapshot(
        query(
          collection(getFirestore(), "retweets"),
          where("tweetID", "==", id),
          where("retweetUid", "==", currentUser.uid)
        ),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "removed") {
              setRetweet(undefined);
            } else {
              setRetweet({ retweetID: change.doc.id, ...change.doc.data() });
            }
          });
        }
      );
    }
    return () => {};
  }, []);

  return (
    <article id={id} className="flex gap-4 items-center p-4 border-b">
      <div className="w-12">
        {profilePicUrl ? (
          <img src={profilePicUrl} alt="" className="rounded-full" />
        ) : (
          <FaUserCircle className="text-5xl" />
        )}
      </div>
      <section>
        {retweetInfo && (
          <p>
            <Link
              to={`/profile/${retweetInfo.retweetUsername}`}
              className="opacity-70 text-sm font-medium hover:underline"
            >
              {retweetInfo.retweetDisplayName} retweeted
            </Link>
          </p>
        )}
        <header className="flex gap-4">
          <h2>
            <Link
              to={`/profile/${username}`}
              className="flex gap-2 items-center"
            >
              <span className="font-bold capitalize hover:underline">
                {name}
              </span>
              <span className="text-gray-400 text-sm">@{username}</span>
            </Link>
          </h2>
          <div className="text-gray-500">
            {formatDistanceToNow(
              timestamp
                ? new Date(secondsToMilliseconds(timestamp.seconds))
                : new Date()
            )}
          </div>
        </header>
        {respondingTo && (
          <p className="text-gray-500 text-sm">
            Resplying to{" "}
            <Link
              to={`/profile/${respondingTo}`}
              className="text-blue-400 hover:underline"
            >
              @{respondingTo}
            </Link>
          </p>
        )}
        <p className="py-2">
          <Link to={`/tweet/${id}`}>{text}</Link>
        </p>
        {!modalTweet && (
          <ul className="flex">
            <li className="flex-1">
              <button type="button" onClick={() => setRespondTo(true)}>
                <FaRegComment />
              </button>
            </li>
            <li className="flex-1">
              <button
                type="button"
                className={retweet ? "text-green-600" : ""}
                onClick={
                  retweet
                    ? () => removeRetweet(retweet.retweetID)
                    : () =>
                        saveRetweet(
                          id,
                          currentUser.uid,
                          currentUser.displayName,
                          currentUser.username
                        )
                }
              >
                <FiRepeat />
              </button>
            </li>
            <li className="flex-1">
              <button
                type="button"
                onClick={
                  liked
                    ? () => {
                        unlike(liked.likeID);
                      }
                    : () => like(id, currentUser.uid)
                }
              >
                {liked ? <FaHeart className="text-red-600" /> : <FaRegHeart />}
              </button>
            </li>
          </ul>
        )}
      </section>

      {respondTo && (
        <div className="z-20 top-0 left-0 absolute w-full h-screen grid place-content-center bg-black/40">
          <button
            type="button"
            className="block ml-auto my-2 text-lg text-white cursor-pointer"
            onClick={() => setRespondTo(false)}
          >
            <FaTimesCircle />
          </button>
          <article className=" p-4 w-[576px] rounded shadow-lg bg-white">
            <TweetItem
              timestamp={timestamp}
              name={name}
              text={text}
              profilePicUrl={profilePicUrl}
              username={username}
              modalTweet
            />
            <TweetForm id={id} username={username} />
          </article>
        </div>
      )}
    </article>
  );
}

TweetItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  profilePicUrl: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  timestamp: PropTypes.shape(PropTypes.object),
  username: PropTypes.string.isRequired,
  modalTweet: PropTypes.bool,
  respondingTo: PropTypes.string,
  retweetInfo: PropTypes.shape(PropTypes.object),
};

TweetItem.defaultProps = {
  timestamp: { seconds: getTime(new Date()) / 1000 },
  modalTweet: false,
  respondingTo: undefined,
  retweetInfo: undefined,
};

export default TweetItem;
