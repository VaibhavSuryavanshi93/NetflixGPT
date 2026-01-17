import React from "react";
import "./App.css";
import Navbar from "./pages/Navbar";
import { Route, Routes } from "react-router-dom";
import Body from "./pages/Body";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="">
      <Provider store={appStore}>
        <Body />
      </Provider>
      <Toaster/>
      <ToastContainer/>
    </div>
  );
};

export default App;
