import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../firebase-config";
import Layout from "./Layout";
import ProfileHead from "./ProfileHead";

function Profile() {
  const [user, setUser] = useState();
  const { username } = useParams();

  // fetch user profile

  useEffect(() => {
    getProfile("username", username).then((u) => {
      setUser(u);
    });
    return () => {};
  }, []);

  // Tweets Related

  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    function deleteTweet(id) {
      setTweets((prevState) => prevState.filter((tweet) => tweet.id !== id));
    }
    function addTweet(
      id,
      timestamp,
      name,
      text,
      profilePicUrl,
      imageUrl,
      tweetUsername
    ) {
      if (!tweets.find((tweet) => id === tweet.id)) {
        setTweets((prevState) => [
          ...prevState,
          {
            id,
            timestamp,
            name,
            text,
            profilePicUrl,
            imageUrl,
            username: tweetUsername,
          },
        ]);
      }
    }

    function loadTweets() {
      const recentTweetsQuery = query(
        collection(getFirestore(), `users/${user.uid}/tweets`),
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
              tweet.imageUrl,
              tweet.username
            );
          }
        });
      });
    }
    if (user) {
      loadTweets();
    }
    return () => {};
  }, [user]);

  if (user) {
    return <Layout head={<ProfileHead user={user} />} tweets={tweets} />;
  }
  return (
    <div className="h-screen w-screen grid place-items-center font-bold text-lg">
      Loading...
    </div>
  );
}

export default Profile;
