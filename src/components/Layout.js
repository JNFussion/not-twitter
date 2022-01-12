import PropTypes from "prop-types";
import React from "react";
import Navbar from "./Navbar";
import ProfileBtn from "./ProfileBtn";
import TweetItem from "./TweetItem";

function Layout({ head, tweets }) {
  return (
    <article className="max-w-6xl mx-auto grid grid-cols-layout">
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
            />
          ))}
        </div>
      </main>
      <aside>ASIDE</aside>
    </article>
  );
}

Layout.propTypes = {
  head: PropTypes.element.isRequired,
  tweets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Layout;
