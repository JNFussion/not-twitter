import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { format } from "date-fns/esm";
import propTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { getCurrentUser } from "../firebase-config";
import FollowBtn from "./FollowBtn";

function currentCount(field, uid, setter) {
  const q = query(
    collection(getFirestore(), "following"),
    where(field, "==", uid)
  );
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "removed") {
        setter((prevState) => prevState - 1);
      } else {
        setter((prevState) => prevState + 1);
      }
    });
  });
}

function ProfileHead({ user }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (user) {
      currentCount("uid", user.uid, setFollowingCount);
      currentCount("following", user.uid, setFollowersCount);
    }

    return () => {};
  }, []);
  return (
    <header>
      <h1 className="p-4 font-bold text-xl">{user.displayName}</h1>

      <div>
        <div className="relative grid grid-rows-5 bg-blue-200">
          <div className="row-start-4 row-end-6">
            <div className="relative z-10 w-32 h-32 mx-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="rounded-full border-2 border-white"
                />
              ) : (
                <FaUserCircle className=" rounded-full text-9xl bg-white" />
              )}
            </div>
            {currentUser && (
              <div className="z-0 absolute bottom-0 w-full bg-white h-1/5">
                {currentUser.uid !== user.uid && <FollowBtn uid={user.uid} />}
              </div>
            )}
          </div>
        </div>
        <div className="m-4">
          <h2 className="font-bold text-lg">{user.displayName}</h2>
          <h3 className="font-medium text-sm opacity-70">@{user.username}</h3>
          <p className="my-4">{user.bio}</p>
        </div>

        <ul className="flex gap-6 m-4 font-medium opacity-70">
          <li className="flex gap-2 items-center">
            <span>
              <GrLocation />
            </span>
            <span>{user.userLocation}</span>
          </li>
          <li className="flex gap-2 items-center">
            <span>
              <FaCalendarAlt />
            </span>
            <span>
              Joined{" "}
              {user.createdAt !== undefined
                ? format(new Date(Date.parse(user.createdAt)), "MMMM yyyy")
                : ""}
            </span>
          </li>
        </ul>
        <ul className="flex gap-6 m-4 font-medium ">
          <li className="flex gap-2 items-center">
            <span className="font-bold">{followingCount}</span>
            <span className="opacity-70">Following</span>
          </li>
          <li className="flex gap-2 items-center">
            <span className="font-bold">{followersCount}</span>
            <span className="opacity-70">Followers</span>
          </li>
        </ul>
      </div>
    </header>
  );
}

ProfileHead.propTypes = {
  user: propTypes.shape(propTypes.object),
};

ProfileHead.defaultProps = {
  user: {},
};

export default ProfileHead;
