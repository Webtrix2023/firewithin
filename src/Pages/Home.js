import React from "react";
import Navbar from "../Components/Navbar";
import Landing from "../Components/Landing";
import Footer from "../Components/Footer";

function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* <div className="shrink-0">
        <Navbar />
      </div> */}
      <Landing />
      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
