import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ProfileBtn from "./ProfileBtn";
import Tweet from "./Tweet";

function Layout({ head }) {
  const [tweets, setTweets] = useState([]);

  // TWEETS RELATED

  useEffect(() => {
    function deleteTweet(id) {
      setTweets((prevState) => prevState.filter((tweet) => tweet.id !== id));
    }
    function addTweet(id, timestamp, name, text, profilePicUrl, imageUrl) {
      if (!tweets.find((tweet) => id === tweet.id)) {
        setTweets((prevState) => [
          ...prevState,
          { id, timestamp, name, text, profilePicUrl, imageUrl },
        ]);
      }
    }

    function loadTweets() {
      const recentTweetsQuery = query(
        collection(getFirestore(), "tweets"),
        orderBy("timestamp", "desc"),
        limit(10)
      );

      onSnapshot(recentTweetsQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            deleteTweet(change.doc.id);
          } else {
            const tweet = change.doc.data();
            addTweet(
              change.doc.id,
              tweet.timestamp,
              tweet.name,
              tweet.text,
              tweet.profilePicUrl,
              tweet.imageUrl
            );
          }
        });
      });
    }
    loadTweets();
    return () => {};
  }, []);

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
            <Tweet
              key={t.id}
              id={t.id}
              timestamp={t.timestamp}
              name={t.name}
              text={t.text}
              profilePicUrl={t.profilePicUrl}
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
};

export default Layout;
