import { format } from "date-fns/esm";
import React, { useState } from "react";
import { FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";

function ProfileHead(params) {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentUser"))
  );
  return (
    <header>
      <h1 className="p-4 font-bold text-xl">{currentUser.displayName}</h1>

      <div>
        <div className="relative grid grid-rows-5 bg-blue-200">
          <div className="row-start-4 row-end-6">
            <div className="relative z-10 w-32 h-32 mx-4">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt=""
                  className="rounded-full"
                />
              ) : (
                <FaUserCircle className=" rounded-full text-9xl bg-white" />
              )}
            </div>
            <div className="z-0 absolute bottom-0 w-full bg-white h-1/5" />
          </div>
        </div>
        <div className="m-4">
          <h2 className="font-bold text-lg">{currentUser.displayName}</h2>
          <h3 className="font-medium text-sm opacity-70">
            @{currentUser.username}
          </h3>
          <p className="my-4">{currentUser.bio}</p>
        </div>

        <ul className="flex gap-6 m-4 font-medium opacity-70">
          <li className="flex gap-2 items-center">
            <span>
              <GrLocation />
            </span>
            <span>{currentUser.userLocation}</span>
          </li>
          <li className="flex gap-2 items-center">
            <span>
              <FaCalendarAlt />
            </span>
            <span>
              Joined{" "}
              {format(currentUser.auth.currentUser.createdAt / 1, "MMMM yyyy")}
            </span>
          </li>
        </ul>
        <ul className="flex gap-6 m-4 font-medium ">
          <li className="flex gap-2 items-center">
            <span className="font-bold">300</span>
            <span className="opacity-70">Following</span>
          </li>
          <li className="flex gap-2 items-center">
            <span className="font-bold">1000</span>
            <span className="opacity-70">Followers</span>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default ProfileHead;
