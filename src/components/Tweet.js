import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import TweetItem from "./TweetItem";

function Tweet() {
  const { id } = useParams();

  const [mainTweet, setMainTweet] = useState();
  const [tweetsResponds, setTweetsResponds] = useState([]);
  useEffect(() => {
    getDoc(doc(getFirestore(), "tweets", id)).then((respond) => {
      setMainTweet({ id: respond.id, ...respond.data() });
    });
    return () => {};
  }, []);

  useEffect(() => {
    setTweetsResponds([]);
    function loadResponds() {
      const responds = query(
        collection(getFirestore(), `tweets/${id}/responds`),
        orderBy("timestamp")
      );
      onSnapshot(responds, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            setTweetsResponds((prevState) =>
              prevState.filter((tweet) => tweet.id !== change.doc.id)
            );
          } else if (!tweetsResponds.find((tweet) => id === tweet.id)) {
            setTweetsResponds((prevState) => [
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

    if (mainTweet) {
      loadResponds();
    }
    return () => {};
  }, [mainTweet]);

  if (mainTweet) {
    console.log(tweetsResponds);
    return (
      <Layout
        head={
          <TweetItem
            id={mainTweet.id}
            timestamp={mainTweet.timestamp}
            name={mainTweet.name}
            text={mainTweet.text}
            profilePicUrl={mainTweet.profilePicUrl}
            username={mainTweet.username}
          />
        }
        tweets={tweetsResponds}
      />
    );
  }
  return (
    <div className="h-screen w-screen grid place-items-center font-bold text-lg">
      Loading...
    </div>
  );
}

export default Tweet;
