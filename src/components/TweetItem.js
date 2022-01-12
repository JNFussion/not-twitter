/* eslint-disable react/forbid-prop-types */
import { formatDistanceToNow, getTime, secondsToMilliseconds } from "date-fns";
import {
  FaRegComment,
  FaRegHeart,
  FaTimesCircle,
  FaUserCircle,
} from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import TweetForm from "./TweetForm";

function TweetItem({
  id,
  name,
  profilePicUrl,
  text,
  timestamp,
  username,
  modalTweet,
  respondingTo,
}) {
  const [respondTo, setRespondTo] = useState(false);
  return (
    <article id={id} className="flex gap-4 p-4 border-b">
      <div className="w-12">
        {profilePicUrl ? (
          <img src={profilePicUrl} alt="" className="rounded-full" />
        ) : (
          <FaUserCircle className="text-5xl" />
        )}
      </div>
      <section>
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
              <button type="button">
                <FiRepeat />
              </button>
            </li>
            <li className="flex-1">
              <button type="button">
                <FaRegHeart />
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
};

TweetItem.defaultProps = {
  timestamp: { seconds: getTime(new Date()) / 1000 },
  modalTweet: false,
  respondingTo: undefined,
};

export default TweetItem;
