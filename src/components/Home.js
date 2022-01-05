import React, { useEffect, useState } from "react";
import HomeHeader from "./HomeHeader";
import Layout from "./Layout";
import Signup from "./Signup";

function Home(params) {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("currentUser"))
  );
  const [missingProfile, setMissingProfile] = useState();
  useEffect(() => {
    if (!currentUser.username) {
      setMissingProfile(true);
    }

    return () => {};
  }, []);

  return (
    <div className="relative">
      {missingProfile && (
        <div className="absolute h-full w-full grid place-content-center bg-black/40">
          <div>
            <Signup />
          </div>
        </div>
      )}
      <Layout head={<HomeHeader />} />
    </div>
  );
}

export default Home;
