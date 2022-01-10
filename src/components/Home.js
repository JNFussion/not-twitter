import React, { useEffect, useState } from "react";
import { getProfileByID } from "../firebase-config";
import HomeHeader from "./HomeHeader";
import Layout from "./Layout";
import Signup from "./Signup";

function Home() {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentUser"))
  );
  const [missingProfile, setMissingProfile] = useState();

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

  return (
    <div className="relative">
      {missingProfile && (
        <div className="absolute h-screen w-full grid place-content-center bg-black/40">
          <div>
            <Signup setMissingProfile={setMissingProfile} />
          </div>
        </div>
      )}
      <Layout head={<HomeHeader />} />
    </div>
  );
}

export default Home;
