import PropTypes from "prop-types";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import FollowBtn from "./FollowBtn";
import Navbar from "./Navbar";
import ProfileBtn from "./ProfileBtn";
import TweetItem from "./TweetItem";

function Layout({ head, tweets }) {
  return (
    <article className="max-w-7xl mx-auto grid grid-cols-layout">
      <div>
        <Navbar />
        <ProfileBtn />
      </div>

      <main className="border-x">
        {head}
        <div className="border-t">
          {tweets.map((t) => (
            <TweetItem
              key={t.id}
              id={t.id}
              timestamp={t.timestamp}
              name={t.name}
              text={t.text}
              profilePicUrl={t.profilePicUrl}
              username={t.username}
              respondingTo={t.respondingTo}
              retweetInfo={t.retweet}
            />
          ))}
        </div>
      </main>
      <aside>
        <article className="m-4 p-4 rounded-md bg-gray-50">
          <h2 className="text-xl font-bold">Who to follow</h2>
          <div className="my-4">
            <article className=" flex gap-4 items-center">
              <div>
                <FaUserCircle className="text-5xl" />
              </div>
              <div>
                <h3 className="font-medium">John Doe</h3>
                <p className=" text-gray-400">@johndoe</p>
              </div>
              <div>
                <FollowBtn uid="" />
              </div>
            </article>
          </div>
        </article>
      </aside>
    </article>
  );
}

Layout.propTypes = {
  head: PropTypes.element.isRequired,
  tweets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Layout;
