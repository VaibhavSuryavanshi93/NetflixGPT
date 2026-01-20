import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { checkValidData } from "../utils/Validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BG_URL, USER_AVATAR } from "../utils/constants";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Login = () => {
  const dispatch = useDispatch();

  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loadingUI, setLoadingUI] = useState(true);

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  /* ---------- Skeleton Loader ---------- */
  useEffect(() => {
    const timer = setTimeout(() => setLoadingUI(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loadingUI && email.current && password.current) {
      email.current.value = "test@demo.com";
      password.current.value = "Test@12!";
    }
  }, [loadingUI]);

  /* ---------- Remember Me ---------- */
  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");

    if (savedEmail && email.current) {
      email.current.value = savedEmail;
      setRememberMe(true);
    }
  }, [loadingUI]);

  const toggleSignInForm = () => setIsSignInForm(!isSignInForm);

  const handleButtonClick = async () => {
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);
    if (message) return;

    if (rememberMe) {
      localStorage.setItem("remember_email", email.current.value);
    } else {
      localStorage.removeItem("remember_email");
    }

    try {
      if (!isSignInForm) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value,
        );

        await updateProfile(userCredential.user, {
          displayName: name.current.value,
          photoURL: USER_AVATAR,
        });

        const {
          uid,
          email: userEmail,
          displayName,
          photoURL,
        } = auth.currentUser;

        dispatch(addUser({ uid, email: userEmail, displayName, photoURL }));
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value,
        );
      }
    } catch (err) {
      setErrorMessage(err.code + " - " + err.message);
    }
  };

  /* ---------- Skeleton UI ---------- */
  if (loadingUI) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-[90%] md:w-3/12 bg-black/50 p-6 md:p-12 rounded-lg">
          <Skeleton height={40} className="mt-4 shimmer opacity-65" />
          <Skeleton height={45} className="mt-4 shimmer opacity-65" />
          <Skeleton height={45} className="mt-4 shimmer" />
          <Skeleton height={45} className="mt-6 shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <img
          src={BG_URL}
          className="w-full h-full object-cover"
          alt="background"
        />
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="
          w-[90%]
          md:w-3/12
          absolute
          p-6 md:p-12
          bg-black/80
          
          top-24 md:my-3
          mx-auto
          right-0 left-0
          text-white
          rounded-lg
          transition-all duration-500
        "
      >
        <h1 className="font-bold text-2xl md:text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="p-3 md:p-4 my-3 w-full bg-gray-700 rounded"
          />
        )}

        <input
          ref={email}
          type="email"
          placeholder="Email Address"
          className="p-3 md:p-4 my-3 w-full bg-gray-700 rounded"
        />

        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-3 md:p-4 my-3 w-full bg-gray-700 rounded"
        />

        {/* Remember Me */}
        <div className="flex items-center gap-2 text-sm text-gray-300 my-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <span>Remember me</span>
        </div>

        {errorMessage && (
          <p className="text-red-500 font-bold text-sm py-2">{errorMessage}</p>
        )}

        <button
          type="submit"
          onClick={handleButtonClick}
          className="p-3 md:p-4 my-4 w-full bg-red-600 hover:bg-red-700 rounded text-lg"
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        <p
          className="py-4 cursor-pointer text-sm text-gray-300 hover:underline"
          onClick={toggleSignInForm}
        >
          {isSignInForm
            ? "New to Netflix? Sign Up Now"
            : "Already a user? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default Login;
