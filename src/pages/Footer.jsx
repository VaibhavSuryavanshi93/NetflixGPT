import React from "react";
import "../App.css";

const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <div className="FooterName">
      <hr />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Play&display=swap"
        rel="stylesheet"
      />

      <div>
        <div class="footer">
          <div class="row">
            <a href="www.google.com">
              <i class="fa fa-facebook"></i>
            </a>
            <a href="google.com">
              <i class="fa fa-instagram"></i>
            </a>
            <a href="google.com">
              <i class="fa fa-youtube"></i>
            </a>
            <a href="google.com">
              <i class="fa fa-twitter"></i>
            </a>
          </div>

          <div class="row">
            <ul>
              <li>
                <a href="www.google.com">Contact us</a>
              </li>
              <li>
                <a href="www.google.com">Our Services</a>
              </li>
              <li>
                <a href="www.google.com">Privacy Policy</a>
              </li>
              <li>
                <a href="www.google.com">Terms & Conditions</a>
              </li>
              <li>
                <a href="www.google.com">Career</a>
              </li>
            </ul>
          </div>

          <div class="row">
            Copyright © {date} Paras Infotech - All rights reserved{" "}
            <span class="author"> Vaibhav Surayavanshi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
