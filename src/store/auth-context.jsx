import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: token => {},
  logout: () => {},
  userEmail: "",
});

export const AuthContextProvider = props => {
  let localStorageData = JSON.parse(localStorage.getItem("userData"));
  if (!localStorageData) {
    localStorageData = {
      userToken: null,
      userEmail: "",
    };
  }
  // localStorage is sync so no need for useEffect

  const [token, setToken] = useState(localStorageData.userToken);
  const [email, setEmail] = useState(localStorageData.userEmail);

  const userIsLoggedIn = !!token;

  const loginHandler = (token, email) => {
    setToken(token);
    setEmail(email);
    // setup localStorage.
    const userData = {
      userToken: token,
      userEmail: email,
    };

    localStorage.setItem("userData", JSON.stringify(userData));
  };

  const logoutHandler = () => {
    setToken(null);
    setEmail("");
    localStorage.clear();
  };

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
