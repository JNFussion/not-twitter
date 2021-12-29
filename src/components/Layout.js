import React from "react";
import Navbar from "./Navbar";
import TweetForm from "./TweetForm";

function Layout(params) {
  return (
    <article className="max-w-6xl mx-auto grid grid-cols-layout">
      <Navbar />
      <main className="border-x">
        <h1 className="p-4 font-bold text-xl">Home</h1>
        <TweetForm />
      </main>
      <aside>ASIDE</aside>
    </article>
  );
}

export default Layout;
