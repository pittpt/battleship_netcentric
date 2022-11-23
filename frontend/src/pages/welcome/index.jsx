import React, { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import "./style.css";
import bannerImg from "../../assets/img/battleship_war_banner.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const WelcomePage = () => {
  const [loadingFlag, setLoadingFlag] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => handleLoadingFlag(), 3000, 1);
    const handleLoadingFlag = () => {
      setLoadingFlag(false);
    };
  }, []);
  const handleNavigate = () => {
    navigate("/join");
  };
  const handleAdminPage = () => {
    navigate("/admin");
  };
  return (
    <div className="welcome-page-container">
      <p className="welcome-page-title">Welcome to Battle Ship</p>
      <div className="welcome-page-banner-container">
        {loadingFlag && (
          <ClipLoader color="#E8175D" className="banner-loading-bar " />
        )}
      </div>
      <p
        className={`click-here-label ${!loadingFlag && "show"}`}
        onClick={() => handleNavigate()}
      >
        Click here to play <FontAwesomeIcon icon={faPlay} />
      </p>
      <p
        className={`nav-admin-page ${!loadingFlag && "show"}`}
        onClick={() => handleAdminPage()}
      >
        for Admin
      </p>
    </div>
  );
};

export default WelcomePage;
