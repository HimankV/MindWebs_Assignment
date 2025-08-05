import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <span
          className="brand-text"
          style={{ fontFamily: "HelveticaNeue", fontSize: "26px" }}
        >
          Assignment - from Himank Verma
        </span>
      </div>
    </div>
  );
};

export default Navbar;
