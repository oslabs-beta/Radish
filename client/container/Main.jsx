import React from "react";
import Slider from "../components/Slider";
import Visual from "../components/Visual";
import Sidebar from "../components/Sidebar";
import RedisForm from "../components/CustForm";
import Header from "../components/Header";

function Main() {
  return (
    <div>
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1">
          <div className="w-1/4 p-4">
            <Slider />
          </div>
          <div className="w-3/4 p-4">
            <Visual />
            <RedisForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
