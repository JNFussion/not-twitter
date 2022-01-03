import { getAuth, signOut } from "firebase/auth";
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Tweet from "./Tweet";
import TweetForm from "./TweetForm";

function signOutUser() {
  signOut(getAuth());
}

function Layout(params) {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentUser"))
  );
  const [isHidden, setIsHidden] = useState(true);
  const [tweets, setTweets] = useState([]);

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
    console.log(tweets);
    loadTweets();
    return () => {};
  }, []);

  return (
    <article className="max-w-6xl mx-auto grid grid-cols-layout">
      <div>
        <Navbar />
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
      </div>

      <main className="border-x">
        <h1 className="p-4 font-bold text-xl">Home</h1>
        <TweetForm currentUser={currentUser} />
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

export default Layout;
