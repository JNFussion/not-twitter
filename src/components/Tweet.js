/* eslint-disable react/forbid-prop-types */
import { formatDistanceToNow, secondsToMilliseconds } from "date-fns";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import PropTypes from "prop-types";
import React from "react";

function Tweet({ id, name, profilePicUrl, text, timestamp }) {
  return (
    <article id={id} className="flex gap-4 p-4 border-b">
      <div className="w-12">
        <img src={profilePicUrl} alt="" className="rounded-full" />
      </div>
      <section>
        <header className="flex gap-4">
          <h2 className="font-bold capitalize">{name}</h2>
          <div className="text-gray-500">
            {formatDistanceToNow(
              new Date(secondsToMilliseconds(timestamp.seconds))
            )}
          </div>
        </header>
        <p className="py-2">{text}</p>
        <div>
          <ul className="flex">
            <li className="flex-1">
              <button type="button">
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
        </div>
      </section>
    </article>
  );
}

Tweet.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  profilePicUrl: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  // eslint-disable-next-line react/require-default-props
  timestamp: PropTypes.any,
};

export default Tweet;
