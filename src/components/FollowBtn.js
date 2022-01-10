import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import propTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../firebase-config";

function follow(currentUserUID, followingUserUID) {
  addDoc(collection(getFirestore(), "following"), {
    uid: currentUserUID,
    following: followingUserUID,
  });
}

function handleSubmit(e, currentUserUID) {
  e.preventDefault();
  follow(currentUserUID, e.target["user-uid"].value);
}

async function unfollow(e, followingDocID) {
  e.preventDefault();
  await deleteDoc(doc(getFirestore(), "following", followingDocID));
}

function FollowBtn({ uid }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [followingDocID, setFollowingDocID] = useState();

  useEffect(() => {
    function currentFollowing() {
      const followingQuery = query(
        collection(getFirestore(), "following"),
        where("uid", "==", currentUser.uid),
        where("following", "==", uid)
      );
      onSnapshot(followingQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            setFollowingDocID();
          } else {
            setFollowingDocID(change.doc.id);
          }
        });
      });
    }

    currentFollowing();
    return () => {};
  }, []);

  return (
    <form
      action=""
      onSubmit={(e) =>
        followingDocID
          ? unfollow(e, followingDocID)
          : handleSubmit(e, currentUser.uid)
      }
      className="w-fit ml-auto"
    >
      <input type="hidden" name="user-uid" value={uid} />
      <button
        type="submit"
        className="m-4 px-4 py-1 rounded-full font-bold text-white bg-black"
      >
        {followingDocID !== undefined ? "Unfollow" : "Follow"}
      </button>
    </form>
  );
}

FollowBtn.propTypes = {
  uid: propTypes.string.isRequired,
};

export default FollowBtn;
