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

  const [ownTweets, setOwnTweets] = useState([]);
  useEffect(() => {
    const recentTweetsQuery = query(
      collection(getFirestore(), "tweets"),
      where("authorUID", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(recentTweetsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "removed") {
          setOwnTweets((prevState) =>
            prevState.filter((tweet) => tweet.id !== change.doc.id)
          );
        }
        if (!ownTweets.find((tweet) => change.doc.id === tweet.id)) {
          setOwnTweets((prevState) => [
            ...prevState,
            {
              id: change.doc.id,
              ...change.doc.data(),
            },
          ]);
        }
      });
    });
    return () => {
      unsub();
    };
  }, []);

  // Fetch following users of current user.

  const [usersFollowing, setUsersFollowing] = useState([]);
  useEffect(() => {
    const q = query(
      collection(getFirestore(), "following"),
      where("uid", "==", currentUser.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const userUID = change.doc.data().following;
        if (change.type === "removed") {
          setUsersFollowing((prevState) => [
            ...prevState.filter((u) => u !== userUID),
          ]);
        }
        if (!usersFollowing.find((u) => u === userUID)) {
          setUsersFollowing((prevState) => [...prevState, userUID]);
        }
      });
    });
    return () => {
      unsub();
    };
  }, []);

  // Fetch tweets of current user's following users.

  const [followingTweets, setFollowingTweets] = useState([]);
  useEffect(() => {
    let unsub;

    if (usersFollowing.length !== 0) {
      const responds = query(
        collection(getFirestore(), "tweets"),
        where("authorUID", "in", usersFollowing),
        orderBy("timestamp")
      );
      onSnapshot(responds, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            setFollowingTweets((prevState) =>
              prevState.filter((tweet) => tweet.id !== change.doc.id)
            );
          }
          if (
            change.type === "added" &&
            !followingTweets.find((tweet) => change.doc.id === tweet.id)
          ) {
            setFollowingTweets((prevState) => [
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

    return () => {
      if (usersFollowing.length !== 0) {
        unsub();
      }
    };
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

      {followingTweets.length !== 0 || usersFollowing.length === 0 ? (
        <Layout
          head={<HomeHeader />}
          tweets={[...ownTweets, ...followingTweets]}
        />
      ) : (
        <div className="h-screen w-screen grid place-items-center font-bold text-lg">
          Loading...
        </div>
      )}
    </div>
  );
}

export default Home;
