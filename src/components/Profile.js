import React from "react";
import Layout from "./Layout";
import ProfileHead from "./ProfileHead";

function Profile(params) {
  return <Layout head={<ProfileHead />} />;
}

export default Profile;
