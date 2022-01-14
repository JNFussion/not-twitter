import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { getCurrentUser, getProfileByID } from "../firebase-config";
import HomeHeader from "./HomeHeader";
import Layout from "./Layout";
import Signup from "./Signup";

function getFollowing(uid, usersFollowing, setter) {
  const q = query(
    collection(getFirestore(), "following"),
    where("uid", "==", uid)
  );
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const userUID = change.doc.data().following;
      if (change.type === "removed") {
        setter((prevState) => [...prevState.filter((u) => u !== userUID)]);
      }
      if (!usersFollowing.find((u) => u === userUID)) {
        setter((prevState) => [...prevState, userUID]);
      }
    });
  });
}

function Home() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [missingProfile, setMissingProfile] = useState();

  // Fetch current user profile

  useEffect(() => {
    getProfileByID(currentUser.uid).then((profile) => {
      if (!profile) {
        setMissingProfile(true);
      } else {
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...currentUser,
            ...profile,
          })
        );
      }
    });

    return () => {};
  }, []);

  // Fetch tweets of current user's following users.
  const [usersFollowing, setUsersFollowing] = useState([]);
  const [feedTweets, setFeedTweets] = useState([]);

  useEffect(() => {
    getFollowing(currentUser.uid, usersFollowing, setUsersFollowing);
    function loadFeed() {
      const responds = query(
        collection(getFirestore(), "tweets"),
        where("authorUID", "in", [...usersFollowing, currentUser.uid]),
        orderBy("timestamp")
      );
      onSnapshot(responds, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            setFeedTweets((prevState) =>
              prevState.filter((tweet) => tweet.id !== change.doc.id)
            );
          }
          if (
            change.type === "added" &&
            !feedTweets.find((tweet) => change.doc.id === tweet.id)
          ) {
            setFeedTweets((prevState) => [
              {
                id: change.doc.id,
                ...change.doc.data(),
              },
              ...prevState,
            ]);
          }
        });
      });
    }

    if (usersFollowing.length !== 0 || currentUser) {
      loadFeed();
    }

    return () => {};
  }, [usersFollowing]);

  return (
    <div className="relative">
      {missingProfile && (
        <div className="absolute h-screen w-full grid place-content-center bg-black/40">
          <div>
            <Signup setMissingProfile={setMissingProfile} />
          </div>
        </div>
      )}

      {feedTweets.length !== 0 || usersFollowing.length === 0 ? (
        <Layout head={<HomeHeader />} tweets={feedTweets.flat()} />
      ) : (
        <div className="h-screen w-screen grid place-items-center font-bold text-lg">
          Loading...
        </div>
      )}
    </div>
  );
}

export default Home;
