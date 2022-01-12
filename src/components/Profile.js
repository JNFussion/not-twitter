import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
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
        collection(getFirestore(), "tweets"),
        where("authorUID", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(25)
      );
      onSnapshot(recentTweetsQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            setTweets((prevState) =>
              prevState.filter((tweet) => tweet.id !== change.doc.id)
            );
          }
          if (!tweets.find((tweet) => change.doc.id === tweet.id)) {
            setTweets((prevState) => [
              ...prevState,
              {
                id: change.doc.id,
                ...change.doc.data(),
              },
            ]);
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
