import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const history = useHistory();

  const isLoggedIn = authCtx.isLoggedIn;
  const logoutHandler = () => {
    authCtx.logout();
    history.replace("/auth");
    console.log("logged out");
  };
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <React.Fragment>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
