import { getAuth } from "firebase/auth";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
