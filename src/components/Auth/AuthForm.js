import { useState, useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
  };

  const submitHandler = event => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    //TODO: validate
    console.log("submitted");
    let loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_AUTH_API_KEY}`;
    let signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_AUTH_API_KEY}`;

    if (isLogin) {
      setIsLoading(false);
      fetch(loginUrl, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(res => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then(data => {
              //TODO: show an error to the user
              let errorMessage = "Authentication failed";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
              }
              // could set Error message in the state
              throw new Error(errorMessage);
            });
          }
        })
        .then(data => {
          authCtx.login(data.idToken);
          history.replace("/");
          // console.log(data);
        })
        .catch(err => {
          alert(err.message);
        });
    } else {
      setIsLoading(true);
      fetch(signupUrl, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(res => {
          setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then(data => {
              //TODO: show an error to the user
              let errorMessage = "signup failed";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
              }
              // could set Error message in the state
              throw new Error(errorMessage);
            });
          }
        })
        .then(data => {
          history.replace("/");
          console.log(data);
        })
        .catch(err => {
          alert(err.message);
        });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input ref={passwordInputRef} type="password" id="password" required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? "Login" : "Create Account"}</button>}
          {isLoading && <p>Loading..</p>}
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
