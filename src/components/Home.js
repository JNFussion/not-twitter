import React from "react";
import HomeHeader from "./HomeHeader";
import Layout from "./Layout";

function Home(params) {
  return <Layout head={<HomeHeader />} />;
}

export default Home;
