// import React from "react";
// import "../App.css";

import { my_pic } from "../utils/constants";
import { Link } from "react-router-dom";


const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 rounded-lgd shadow ">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="flex items-center flex-col md:flex-row justify-between">
          <a
            href="https://vaibhavsuryavanshi.vercel.app/"
            className="flex items-center mb-6 md:mb-2"
          >
            <img
              src={my_pic}
              className="md:h-16 h-6 rounded-md  mr-3"
              alt="Flowbite Logo"
            />
            <span className="author text-sm md:text-2xl text-gray-50  ">
              Vaibhav Surayavanshi
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-2 text-sm font-medium text-gray-500">
            <li>
              <Link
                to="https://vaibhavsuryavanshi.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="mr-4 hover:underline md:mr-6"
              >
                About
              </Link>
            </li>
            <li>
              <a href="#!" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/vaibhav-suryavanshi-52784b253/"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Contact to us{" "}
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 sm:mx-auto border-[#282727] lg:my-8" />
        <div className="text-gray-400  text-center">
          Copyright © {date} - All rights reserved{" "}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
