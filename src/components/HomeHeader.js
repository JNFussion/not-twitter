import React from "react";
import TweetForm from "./TweetForm";

function HomeHeader(params) {
  return (
    <header>
      <h1 className="p-4 font-bold text-xl">Home</h1>
      <TweetForm />
    </header>
  );
}

export default HomeHeader;
