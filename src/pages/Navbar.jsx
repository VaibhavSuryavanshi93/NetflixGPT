import React, { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, SUPPORTED_LANGUAGES } from "../utils/constants";
import { toggleGptSearchView } from "../utils/GptSlice";
import { changeLanguage } from "../utils/configSlice";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SearchIcon from "@mui/icons-material/Search";
const Navbar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        navigate("/error");
        error;
      });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
        // ...
      } else {
        dispatch(removeUser());
        navigate("/");
        // User is signed out
        // ...
      }
    });
    // Unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };
  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };
  return (
    <div className="absolute w-screen px-4 py-2 bg-gradient-to-b from-black z-10 flex items-center justify-between md:px-8 md:py-2 md:items-start">
      <Link to="/browse">
        <img
          className="w-28 mt-0 ml-0 md:w-44 md:-ml-4 md:mx-0"
          src={LOGO}
          alt="logo"
        />
      </Link>
      {user && (
        <div className="flex items-center p-0 md:p-2  justify-between">
          {showGptSearch && (
            <select
              className="p-2 m-2 bg-black/40 text-white border-t-indigo-600 rounded-lg  cursor-pointer hover:text-blue-400"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.identifier} value={lang.identifier}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}
          <button
            className="flex items-center justify-center py-2 px-3 mx-1 my-1 md:mx-4 md:my-2 border-t-indigo-600 text-white rounded-lg hover:bg-gray-200/10 cursor-pointer hover:text-yellow-400"
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? (
              ""
            ) : (
              <SearchOutlinedIcon
                style={{ fontSize: "28px", marginRight: "8px" }}
              />
            )}

            {showGptSearch ? "Homepage" : "Search"}
          </button>
          <img
            className="hidden md:block w-12 h-12"
            alt="usericon"
            src={user?.photoURL}
          />
          <button onClick={handleSignOut} className="font-bold text-white cursor-pointer hover:text-amber-50 ">
            (Sign Out)
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
