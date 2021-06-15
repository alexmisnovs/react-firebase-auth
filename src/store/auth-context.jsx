import React, { useState, useEffect, useCallback } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: token => {},
  logout: () => {},
  userEmail: "",
});

const calculateRemainingTime = expirationTime => {
  const currentTime = new Date().getTime();
  const adjustedExpirationTime = new Date(expirationTime).getTime();
  const remainingTime = adjustedExpirationTime - currentTime;

  return remainingTime;
};
const retrieveStoredToken = () => {
  let localStorageData = JSON.parse(localStorage.getItem("userData"));
  if (localStorageData) {
    const storedToken = localStorageData.userToken;
    const storedExpirationTime = localStorageData.expirationTime;
    const remaminingTime = calculateRemainingTime(storedExpirationTime);

    if (remaminingTime <= 60000) {
      localStorageData.clear();
      return null;
    }
    return { storedToken, duration: remaminingTime };
  }
};
export const AuthContextProvider = props => {
  let localStorageData = JSON.parse(localStorage.getItem("userData"));
  let userToken, userEmail;
  let storedTokenData;

  if (localStorageData) {
    storedTokenData = retrieveStoredToken();
    userToken = storedTokenData.storedToken;
    userEmail = localStorageData.userEmail;
  } else {
    userToken = null;
    userEmail = "";
  }

  // localStorage is sync so no need for useEffect

  const [token, setToken] = useState(userToken);
  const [email, setEmail] = useState(userEmail);

  const userIsLoggedIn = !!token;
  let logoutTimer;

  const logoutHandler = useCallback(() => {
    setToken(null);
    setEmail("");
    localStorage.clear();
  }, []);

  const loginHandler = (token, email, expirationTime) => {
    setToken(token);
    setEmail(email);
    // setup localStorage.
    const userData = {
      userToken: token,
      userEmail: email,
      expirationTime,
    };

    localStorage.setItem("userData", JSON.stringify(userData));
    // get remaining time
    const remainingTime = calculateRemainingTime(expirationTime);
    // set timer and logout
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };
  useEffect(() => {
    if (storedTokenData) {
      console.log(storedTokenData.duration);
      logoutTimer = setTimeout(logoutHandler, storedTokenData.duration);
    }
  }, [storedTokenData, logoutHandler]);
  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    userEmail: email,
    login: loginHandler,
    logout: logoutHandler,
  };
  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
