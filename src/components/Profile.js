import {
  collection,
  documentId,
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

function getRetweetsRef(userUID, setter, arr) {
  onSnapshot(
    query(
      collection(getFirestore(), "retweets"),
      where("retweetUid", "==", userUID)
    ),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          setter((prevState) => [
            ...prevState.filter((u) => u.id !== change.doc.id),
          ]);
        }
        if (!arr.find((u) => u.id === change.doc.id)) {
          setter((prevState) => [
            ...prevState,
            { id: change.doc.id, ...change.doc.data() },
          ]);
        }
      });
    }
  );
}

function allTweets(ownTweets, retweets) {
  const all = [...ownTweets, ...retweets];
  return all.sort((a, b) => a.timestamp.seconds > b.timestamp.seconds);
}

function Profile() {
  const [user, setUser] = useState();
  const { username } = useParams();

  // fetch user profile

  useEffect(() => {
    getProfile("username", username).then((u) => {
      setUser(u);
    });
    return () => {};
  }, [username]);

  // Tweets Related

  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    let unsub;
    if (user) {
      setTweets([]);
      const recentTweetsQuery = query(
        collection(getFirestore(), "tweets"),
        where("authorUID", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(25)
      );
      unsub = onSnapshot(recentTweetsQuery, (snapshot) => {
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
    return () => {
      if (user) {
        unsub();
      }
    };
  }, [user]);

  const [retweetsRef, setRetweetsRef] = useState([]);
  const [retweets, setRetweets] = useState([]);
  useEffect(() => {
    if (user) {
      getRetweetsRef(user.uid, setRetweetsRef, retweetsRef);
    }
    return () => {};
  }, [user]);

  useEffect(() => {
    let unsub;
    if (retweetsRef.length !== 0) {
      unsub = onSnapshot(
        query(
          collection(getFirestore(), "tweets"),
          where(
            documentId(),
            "in",
            retweetsRef.map((i) => i.tweetID)
          )
        ),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "removed") {
              setRetweets((prevState) => [
                ...prevState.filter((u) => u.id !== change.doc.id),
              ]);
            }
            if (!retweets.find((u) => u.id === change.doc.id)) {
              const retweet = retweetsRef.find(
                (r) => r.tweetID === change.doc.id
              );
              setRetweets((prevState) => [
                ...prevState,
                { id: change.doc.id, ...change.doc.data(), retweet },
              ]);
            }
          });
        }
      );
    }
    return () => {};
  }, [retweetsRef]);

  if (user) {
    return (
      <Layout
        head={<ProfileHead user={user} />}
        tweets={allTweets(tweets, retweets)}
      />
    );
  }
  return (
    <div className="h-screen w-screen grid place-items-center font-bold text-lg">
      Loading...
    </div>
  );
}

export default Profile;
